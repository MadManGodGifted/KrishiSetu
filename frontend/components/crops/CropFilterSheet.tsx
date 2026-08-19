import { useEffect, useState, type ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  countActiveFilters,
  defaultFilters,
  type ClimateFilter,
  type CropFilters,
  type CropSort,
  type DurationFilter,
  type WaterFilter,
} from '@/constants/crops';
import { colors, fonts, radius, shadows } from '@/constants/theme';
import { AppText, Button, PressableScale, SelectableChip } from '@/components/ui';

type Props = {
  open: boolean;
  value: CropFilters;
  onClose: () => void;
  onApply: (next: CropFilters) => void;
};

const sorts: { value: CropSort; label: string }[] = [
  { value: 'match', label: 'Best match' },
  { value: 'profit', label: 'Highest profit' },
  { value: 'input', label: 'Lowest input' },
  { value: 'market', label: 'Market & MSP' },
];

const durations: { value: DurationFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'short', label: '60–90 days' },
  { value: 'medium', label: '120–150 days' },
  { value: 'long', label: 'Long' },
];

const waters: { value: WaterFilter; label: string }[] = [
  { value: 'all', label: 'Any' },
  { value: 'low', label: 'Low / rain-fed' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const climates: { value: ClimateFilter; label: string }[] = [
  { value: 'all', label: 'Any' },
  { value: 'resilient', label: 'Safest' },
  { value: 'drought', label: 'Dry-spell hardy' },
  { value: 'flood', label: 'Flood hardy' },
];

export function CropFilterSheet({ open, value, onClose, onApply }: Props) {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState(value);
  const [openKey, setOpenKey] = useState('sort');

  useEffect(() => {
    if (open) {
      setDraft(value);
      setOpenKey('sort');
    }
  }, [open, value]);

  const active = countActiveFilters(draft);

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={styles.handle} />
          <View style={styles.head}>
            <AppText variant="h2">Filters</AppText>
            {active > 0 ? (
              <PressableScale onPress={() => setDraft({ ...defaultFilters, sort: draft.sort })}>
                <AppText style={styles.clear}>Reset {active}</AppText>
              </PressableScale>
            ) : null}
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
            <Group title="Sort" open={openKey === 'sort'} onToggle={() => setOpenKey(openKey === 'sort' ? '' : 'sort')}>
              {sorts.map((item) => (
                <SelectableChip
                  key={item.value}
                  label={item.label}
                  selected={draft.sort === item.value}
                  onPress={() => setDraft({ ...draft, sort: item.value })}
                />
              ))}
            </Group>
            <Group
              title="Duration"
              open={openKey === 'duration'}
              onToggle={() => setOpenKey(openKey === 'duration' ? '' : 'duration')}>
              {durations.map((item) => (
                <SelectableChip
                  key={item.value}
                  label={item.label}
                  selected={draft.duration === item.value}
                  onPress={() => setDraft({ ...draft, duration: item.value })}
                />
              ))}
            </Group>
            <Group title="Water" open={openKey === 'water'} onToggle={() => setOpenKey(openKey === 'water' ? '' : 'water')}>
              {waters.map((item) => (
                <SelectableChip
                  key={item.value}
                  label={item.label}
                  selected={draft.water === item.value}
                  onPress={() => setDraft({ ...draft, water: item.value })}
                />
              ))}
            </Group>
            <Group
              title="Market"
              open={openKey === 'market'}
              onToggle={() => setOpenKey(openKey === 'market' ? '' : 'market')}>
              <SelectableChip
                label="MSP only"
                selected={draft.mspOnly}
                onPress={() => setDraft({ ...draft, mspOnly: !draft.mspOnly })}
              />
              <SelectableChip
                label="High demand"
                selected={draft.highDemandOnly}
                onPress={() => setDraft({ ...draft, highDemandOnly: !draft.highDemandOnly })}
              />
            </Group>
            <Group title="Risk" open={openKey === 'risk'} onToggle={() => setOpenKey(openKey === 'risk' ? '' : 'risk')}>
              {climates.map((item) => (
                <SelectableChip
                  key={item.value}
                  label={item.label}
                  selected={draft.climate === item.value}
                  onPress={() => setDraft({ ...draft, climate: item.value })}
                />
              ))}
            </Group>
          </ScrollView>

          <View style={styles.actions}>
            <Button title="Cancel" variant="secondary" onPress={onClose} />
            <View style={{ flex: 1 }}>
              <Button
                title="Apply filters"
                onPress={() => {
                  onApply(draft);
                  onClose();
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function Group({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <View style={styles.group}>
      <PressableScale onPress={onToggle} style={styles.groupHead}>
        <AppText variant="title">{title}</AppText>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} />
      </PressableScale>
      {open ? <View style={styles.chips}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.overlay },
  backdrop: { ...StyleSheet.absoluteFillObject },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: 20,
    paddingTop: 10,
    ...shadows.floating,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: 12,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  clear: { fontFamily: fonts.bold, fontSize: 13, color: colors.primary },
  group: { borderTopWidth: 1, borderTopColor: colors.border, paddingVertical: 6 },
  groupHead: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingBottom: 12 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 8, alignItems: 'stretch' },
});
