import { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';

import { colors, fonts } from '@/constants/theme';
import { AppText, PressableScale } from '@/components/ui';

type Props = {
  labels: string[];
  values: number[];
  years?: string[];
  yLabel?: string;
};

export function YieldChart({ labels, values, years, yLabel = 'q / acre' }: Props) {
  const [width, setWidth] = useState(0);
  const [selected, setSelected] = useState<number | null>(values.length - 1);
  const height = 188;
  const padL = 36;
  const padR = 12;
  const padT = 16;
  const padB = 12;

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const { line, area, pts, ticks } = useMemo(() => {
    if (!width || values.length < 2) {
      return { line: '', area: '', pts: [] as { x: number; y: number }[], ticks: [] as number[] };
    }
    const min = Math.min(...values) - 1;
    const max = Math.max(...values) + 1;
    const innerW = width - padL - padR;
    const innerH = height - padT - padB;
    const points = values.map((v, i) => {
      const x = padL + (i / (values.length - 1)) * innerW;
      const y = padT + innerH - ((v - min) / (max - min)) * innerH;
      return { x, y };
    });
    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padB} L ${points[0].x} ${height - padB} Z`;
    const ticks = [max, (min + max) / 2, min].map((n) => Number(n.toFixed(1)));
    return { line: linePath, area: areaPath, pts: points, ticks };
  }, [width, values]);

  const active = selected != null ? selected : values.length - 1;
  const year = years?.[active] ?? `20${labels[active]}`;

  return (
    <View>
      <View onLayout={onLayout} style={styles.wrap}>
        <AppText style={styles.yLabel}>{yLabel}</AppText>
        {width > 0 ? (
          <Svg width={width} height={height}>
            <Defs>
              <LinearGradient id="yieldFill" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={colors.primary} stopOpacity="0.28" />
                <Stop offset="1" stopColor={colors.primary} stopOpacity="0.02" />
              </LinearGradient>
            </Defs>
            {ticks.map((tick, i) => {
              const y = padT + ((height - padT - padB) * i) / Math.max(ticks.length - 1, 1);
              return (
                <Line
                  key={`${tick}-${i}`}
                  x1={padL}
                  y1={y}
                  x2={width - padR}
                  y2={y}
                  stroke={colors.border}
                  strokeDasharray="4 6"
                />
              );
            })}
            <Path d={area} fill="url(#yieldFill)" />
            <Path d={line} stroke={colors.primary} strokeWidth={2.5} fill="none" strokeLinecap="round" />
            {pts.map((p, i) => (
              <Circle
                key={labels[i]}
                cx={p.x}
                cy={p.y}
                r={i === active ? 6 : 4}
                fill={colors.white}
                stroke={colors.primary}
                strokeWidth={i === active ? 3 : 2}
              />
            ))}
          </Svg>
        ) : (
          <View style={{ height }} />
        )}
        {width > 0 && ticks.length > 0 ? (
          <View pointerEvents="none" style={styles.yTicks}>
            {ticks.map((tick, i) => (
              <AppText key={`${tick}-${i}`} style={styles.tick}>
                {tick}
              </AppText>
            ))}
          </View>
        ) : null}
        {width > 0 && pts.length > 0 ? (
          <View style={styles.hitRow}>
            {pts.map((p, i) => (
              <PressableScale
                key={labels[i]}
                onPress={() => setSelected(i)}
                style={[styles.hit, { left: p.x - 18 }]}>
                <View />
              </PressableScale>
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.labels}>
        {labels.map((label, i) => (
          <AppText key={label} style={[styles.label, i === active && styles.labelOn]}>
            ’{label}
          </AppText>
        ))}
      </View>

      <View style={styles.tooltip}>
        <AppText variant="label">{year}</AppText>
        <AppText variant="title">
          {values[active]} {yLabel}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', position: 'relative' },
  yLabel: {
    position: 'absolute',
    left: 0,
    top: 0,
    fontFamily: fonts.semibold,
    fontSize: 10,
    color: colors.textMuted,
    zIndex: 2,
  },
  yTicks: {
    position: 'absolute',
    left: 0,
    top: 14,
    bottom: 10,
    width: 34,
    justifyContent: 'space-between',
  },
  tick: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.textMuted,
  },
  hitRow: {
    ...StyleSheet.absoluteFillObject,
  },
  hit: {
    position: 'absolute',
    top: 0,
    width: 36,
    height: '100%',
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 36,
    paddingRight: 8,
    marginTop: 4,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.textMuted,
  },
  labelOn: {
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  tooltip: {
    marginTop: 12,
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
