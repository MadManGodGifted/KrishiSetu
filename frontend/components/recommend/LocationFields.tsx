import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppText, Input, PressableScale, Select } from '@/components/ui';
import { STATE_NAMES, districtsFor } from '@/constants/india';
import { colors, fonts, radius, shadows, spacing } from '@/constants/theme';
import {
  getDeviceCoords,
  isValidPin,
  reverseGeocode,
  searchPlaces,
  type GeoCoords,
  type ResolvedAddress,
} from '@/lib/location';

export type LocationValue = {
  state: string;
  district: string;
  subDistrict: string;
  village: string;
  pin: string;
  coords: GeoCoords | null;
};

type Props = {
  value: LocationValue;
  onChange: (next: LocationValue) => void;
  errors?: Partial<Record<'state' | 'district' | 'pin', string>>;
};

export function LocationFields({ value, onChange, errors }: Props) {
  const [locating, setLocating] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [geoError, setGeoError] = useState('');
  const districts = districtsFor(value.state);

  const patch = (partial: Partial<LocationValue>) => onChange({ ...value, ...partial });

  const applyPlace = (place: ResolvedAddress) => {
    patch({
      state: place.state,
      district: place.district,
      subDistrict: place.subDistrict,
      village: place.village,
      pin: place.pin,
      coords: place.coords,
    });
    setGeoError('');
  };

  const useCurrentLocation = async () => {
    setLocating(true);
    setGeoError('');
    try {
      const coords = await getDeviceCoords();
      const place = await reverseGeocode(coords);
      applyPlace(place);
    } catch (err) {
      setGeoError(err instanceof Error ? err.message : 'Could not read your location.');
    } finally {
      setLocating(false);
    }
  };

  return (
    <View style={styles.block}>
      <AppText variant="label">Field location</AppText>

      <View style={styles.row}>
        <Select
          style={styles.col}
          label="State"
          placeholder="Select state"
          value={value.state}
          options={STATE_NAMES}
          onChange={(state) =>
            patch({
              state,
              district: districtsFor(state).includes(value.district) ? value.district : '',
            })
          }
          error={errors?.state}
          icon={<Ionicons name="map-outline" size={18} color={colors.textMuted} />}
        />
        <Select
          style={styles.col}
          label="District"
          placeholder={value.state ? 'Select district' : 'Select state first'}
          value={value.district}
          options={districts}
          onChange={(district) => patch({ district })}
          disabled={!value.state}
          error={errors?.district}
        />
      </View>

      <View style={styles.row}>
        <Input
          containerStyle={styles.col}
          label="Sub-district"
          placeholder="Tehsil / taluka"
          value={value.subDistrict}
          onChangeText={(subDistrict) => patch({ subDistrict })}
        />
        <Input
          containerStyle={styles.col}
          label="Village / town"
          placeholder="Village or city"
          value={value.village}
          onChangeText={(village) => patch({ village })}
        />
      </View>

      <Input
        label="PIN code"
        placeholder="6-digit PIN"
        keyboardType="number-pad"
        inputMode="numeric"
        maxLength={6}
        value={value.pin}
        onChangeText={(text) => patch({ pin: text.replace(/\D/g, '').slice(0, 6) })}
        error={errors?.pin}
        hint={
          value.pin.length > 0 && !isValidPin(value.pin) ? 'PIN must be a 6-digit Indian postal code.' : undefined
        }
      />

      <View style={styles.actions}>
        <PressableScale onPress={useCurrentLocation} style={styles.action} disabled={locating}>
          {locating ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <>
              <Ionicons name="navigate-outline" size={18} color={colors.primary} />
              <AppText variant="title" color={colors.primary} style={styles.actionLabel}>
                Use current location
              </AppText>
            </>
          )}
        </PressableScale>
        <PressableScale onPress={() => setMapOpen(true)} style={styles.action}>
          <Ionicons name="location-outline" size={18} color={colors.primary} />
          <AppText variant="title" color={colors.primary} style={styles.actionLabel}>
            Pin on map
          </AppText>
        </PressableScale>
      </View>

      {value.coords ? (
        <AppText variant="caption">
          Pinned {value.coords.lat.toFixed(4)}° N, {value.coords.lon.toFixed(4)}° E
        </AppText>
      ) : null}
      {geoError ? (
        <AppText variant="caption" color={colors.danger}>
          {geoError}
        </AppText>
      ) : null}

      <MapPinModal
        visible={mapOpen}
        onClose={() => setMapOpen(false)}
        onSelect={(place) => {
          applyPlace(place);
          setMapOpen(false);
        }}
      />
    </View>
  );
}

function MapPinModal({
  visible,
  onClose,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (place: ResolvedAddress) => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ResolvedAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visible) {
      setQuery('');
      setResults([]);
      setError('');
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    const handle = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        setResults(await searchPlaces(q));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed.');
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(handle);
  }, [query, visible]);

  const pinGps = async () => {
    setGpsLoading(true);
    setError('');
    try {
      const coords = await getDeviceCoords();
      onSelect(await reverseGeocode(coords));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read your location.');
    } finally {
      setGpsLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.overlay} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.sheetHead}>
            <AppText variant="h2">Pin your field</AppText>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>
          <AppText variant="caption" style={styles.sheetCopy}>
            Search a village, district, or PIN, or drop a pin from GPS.
          </AppText>

          <PressableScale onPress={pinGps} style={styles.gps} disabled={gpsLoading}>
            {gpsLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <>
                <Ionicons name="navigate" size={16} color={colors.white} />
                <AppText variant="title" color={colors.white}>
                  Use current location
                </AppText>
              </>
            )}
          </PressableScale>

          <View style={styles.search}>
            <Ionicons name="search" size={16} color={colors.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search place in India"
              placeholderTextColor={colors.textMuted}
              style={styles.searchInput}
            />
            {loading ? <ActivityIndicator color={colors.primary} /> : null}
          </View>

          {error ? (
            <AppText variant="caption" color={colors.danger} style={{ marginHorizontal: 20 }}>
              {error}
            </AppText>
          ) : null}

          <ScrollView
            style={styles.results}
            contentContainerStyle={styles.resultsContent}
            keyboardShouldPersistTaps="handled">
            {results.map((item) => (
              <PressableScale key={`${item.label}-${item.coords.lat}`} onPress={() => onSelect(item)} style={styles.result}>
                <Ionicons name="location" size={16} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <AppText variant="title">{item.village || item.district || item.state}</AppText>
                  <AppText variant="caption" numberOfLines={2}>
                    {item.label}
                  </AppText>
                </View>
              </PressableScale>
            ))}
            {!loading && query.trim().length >= 2 && results.length === 0 ? (
              <AppText variant="caption" align="center" style={{ padding: 16 }}>
                No matching places
              </AppText>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  block: { gap: 12 },
  row: { flexDirection: 'row', gap: 12 },
  col: { flex: 1, minWidth: 0 },
  actions: { flexDirection: 'row', gap: 8 },
  action: {
    flex: 1,
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },
  actionLabel: { fontFamily: fonts.semibold, fontSize: 13, textAlign: 'center' },
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.overlay },
  sheet: {
    maxHeight: '82%',
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: 12,
    ...shadows.floating,
  },
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  sheetCopy: { paddingHorizontal: spacing.xl },
  gps: {
    marginHorizontal: spacing.xl,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  search: {
    marginHorizontal: spacing.xl,
    minHeight: 48,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 10,
    outlineWidth: 0,
  },
  results: { maxHeight: 280, paddingHorizontal: 8 },
  resultsContent: { gap: 8, paddingBottom: 8 },
  result: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    alignItems: 'flex-start',
  },
});
