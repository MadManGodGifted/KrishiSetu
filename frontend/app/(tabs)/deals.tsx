import { useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { ProductCard } from '@/components/deals/ProductCard';
import { AppText, Input, Screen, SelectableChip } from '@/components/ui';
import { dealCategories, deals, type DealCategory } from '@/constants/dummy';
import { colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function DealsScreen() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<DealCategory>('All');

  const filtered = useMemo(() => {
    return deals.filter((deal) => {
      const matchesCategory = category === 'All' || deal.category === category;
      const haystack = `${deal.name} ${deal.dealer}`.toLowerCase();
      return matchesCategory && haystack.includes(query.toLowerCase());
    });
  }, [query, category]);

  return (
    <Screen>
      <AppText variant="display">Smart deals</AppText>
      <AppText variant="body" color={colors.textSecondary}>
        Inputs matched to your latest recommendation.
      </AppText>

      <Input
        placeholder="Search seeds, fertilizer..."
        value={query}
        onChangeText={setQuery}
        icon={<Ionicons name="search" size={18} color={colors.textMuted} />}
      />

      <View style={styles.cats}>
        {dealCategories.map((item) => (
          <SelectableChip
            key={item}
            label={item}
            selected={category === item}
            onPress={() => setCategory(item)}
          />
        ))}
      </View>

      <View style={styles.grid}>
        {filtered.map((deal) => (
          <View key={deal.id} style={styles.cell}>
            <ProductCard
              deal={deal}
              onBuy={(item) =>
                Alert.alert(item.name, `${item.dealer} · ₹${item.price.toLocaleString('en-IN')}`)
              }
            />
          </View>
        ))}
      </View>

      {filtered.length === 0 ? (
        <AppText variant="caption" align="center">
          No products match that search.
        </AppText>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  cats: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  cell: { width: '48%', flexGrow: 1 },
});
