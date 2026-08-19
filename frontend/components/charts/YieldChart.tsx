import { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { yieldForecast } from '@/constants/dummy';
import { colors, fonts } from '@/constants/theme';
import { AppText } from '@/components/ui';

export function YieldChart() {
  const [width, setWidth] = useState(0);
  const height = 168;
  const pad = 12;
  const values = yieldForecast.chart.values;
  const labels = yieldForecast.chart.labels;

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const { line, area } = useMemo(() => {
    if (!width) return { line: '', area: '' };
    const min = Math.min(...values) - 1;
    const max = Math.max(...values) + 1;
    const innerW = width - pad * 2;
    const innerH = height - pad * 2;
    const pts = values.map((v, i) => {
      const x = pad + (i / (values.length - 1)) * innerW;
      const y = pad + innerH - ((v - min) / (max - min)) * innerH;
      return { x, y };
    });
    const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${height - pad} L ${pts[0].x} ${height - pad} Z`;
    return { line: linePath, area: areaPath, pts };
  }, [width, values]);

  return (
    <View onLayout={onLayout} style={styles.wrap}>
      {width > 0 ? (
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id="yieldFill" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.primary} stopOpacity="0.28" />
              <Stop offset="1" stopColor={colors.primary} stopOpacity="0.02" />
            </LinearGradient>
          </Defs>
          <Path d={area} fill="url(#yieldFill)" />
          <Path d={line} stroke={colors.primary} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          {values.map((v, i) => {
            const min = Math.min(...values) - 1;
            const max = Math.max(...values) + 1;
            const innerW = width - pad * 2;
            const innerH = height - pad * 2;
            const x = pad + (i / (values.length - 1)) * innerW;
            const y = pad + innerH - ((v - min) / (max - min)) * innerH;
            return <Circle key={labels[i]} cx={x} cy={y} r={4} fill={colors.white} stroke={colors.primary} strokeWidth={2} />;
          })}
        </Svg>
      ) : (
        <View style={{ height }} />
      )}
      <View style={styles.labels}>
        {labels.map((label) => (
          <AppText key={label} style={styles.label}>
            ’{label}
          </AppText>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 4,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.textMuted,
  },
});
