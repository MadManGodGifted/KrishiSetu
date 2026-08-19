import { useMemo, useState, type ReactNode } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts, radius, shadows, spacing } from '@/constants/theme';

import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

export type SelectOption = {
  label: string;
  value: string;
  group?: string;
};

type Props = {
  label?: string;
  placeholder?: string;
  value: string;
  options: SelectOption[] | string[];
  onChange: (value: string) => void;
  disabled?: boolean;
  searchable?: boolean;
  icon?: ReactNode;
  error?: string;
  hint?: string;
  style?: StyleProp<ViewStyle>;
};

function normalize(options: SelectOption[] | string[]): SelectOption[] {
  return options.map((item) =>
    typeof item === 'string' ? { label: item, value: item } : item,
  );
}

export function Select({
  label,
  placeholder = 'Select',
  value,
  options,
  onChange,
  disabled,
  searchable,
  icon,
  error,
  hint,
  style,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const items = useMemo(() => normalize(options), [options]);
  const selected = items.find((item) => item.value === value);
  const enableSearch = searchable ?? items.length > 8;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [items, query]);

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  return (
    <View style={[styles.wrap, style]}>
      {label ? (
        <AppText variant="label" style={styles.label}>
          {label}
        </AppText>
      ) : null}

      <PressableScale
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={[styles.field, error ? styles.fieldError : null, disabled && styles.disabled]}>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <AppText
          variant="title"
          color={selected ? colors.text : colors.textMuted}
          numberOfLines={1}
          style={styles.value}>
          {selected?.label ?? placeholder}
        </AppText>
        <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
      </PressableScale>

      {error ? (
        <AppText variant="caption" color={colors.danger} style={styles.meta}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" style={styles.meta}>
          {hint}
        </AppText>
      ) : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={close}>
        <View style={styles.modalRoot}>
          <Pressable style={styles.overlay} onPress={close} />
          <View style={styles.sheet}>
            <View style={styles.sheetHead}>
              <AppText variant="h2">{label ?? 'Select'}</AppText>
              <Pressable onPress={close} hitSlop={8}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </Pressable>
            </View>

            {enableSearch ? (
              <View style={styles.search}>
                <Ionicons name="search" size={16} color={colors.textMuted} />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search"
                  placeholderTextColor={colors.textMuted}
                  style={styles.searchInput}
                  autoFocus
                />
              </View>
            ) : null}

            <FlatList
              data={filtered}
              keyExtractor={(item) => item.value}
              keyboardShouldPersistTaps="handled"
              style={styles.list}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <AppText variant="caption" align="center" style={{ padding: 20 }}>
                  No matches
                </AppText>
              }
              renderItem={({ item }) => {
                const on = item.value === value;
                return (
                  <Pressable
                    onPress={() => {
                      onChange(item.value);
                      close();
                    }}
                    style={[styles.option, on && styles.optionOn]}>
                    <AppText
                      variant="title"
                      color={on ? colors.primaryDark : colors.text}
                      style={{ flex: 1 }}>
                      {item.label}
                    </AppText>
                    {on ? <Ionicons name="checkmark" size={18} color={colors.primary} /> : null}
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  label: { marginLeft: 4 },
  field: {
    minHeight: 56,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fieldError: { borderColor: colors.danger },
  disabled: { opacity: 0.5 },
  icon: { width: 22, alignItems: 'center' },
  value: { flex: 1, fontFamily: fonts.medium, fontSize: 16 },
  meta: { marginLeft: 4 },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  sheet: {
    maxHeight: '78%',
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    ...shadows.floating,
  },
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    marginBottom: 12,
  },
  search: {
    marginHorizontal: spacing.xl,
    marginBottom: 8,
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
  list: { flexGrow: 0, maxHeight: 420 },
  listContent: { paddingHorizontal: spacing.md, paddingBottom: 8 },
  option: {
    minHeight: 52,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionOn: {
    backgroundColor: colors.primarySoft,
  },
});
