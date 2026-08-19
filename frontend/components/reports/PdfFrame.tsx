import { Platform, StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';

type Props = {
  html: string;
};

export function PdfFrame({ html }: Props) {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    return (
      <View style={styles.webWrap}>
        <iframe
          title="PDF preview"
          srcDoc={html}
          style={{
            width: '100%',
            height: '100%',
            border: '0',
            background: '#5c6560',
            writingMode: 'horizontal-tb',
          }}
          sandbox="allow-modals allow-popups allow-same-origin"
        />
      </View>
    );
  }

  return <View style={styles.fallback} />;
}

const styles = StyleSheet.create({
  webWrap: { flex: 1, minHeight: 480, backgroundColor: '#5c6560' },
  fallback: { flex: 1, backgroundColor: colors.background },
});
