import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import RenderHTML, { HTMLContentModel, HTMLElementModel, MixedStyleRecord } from 'react-native-render-html';

// Helper function to replace p-image tags with img tags
// function replacePImageWithImg(html: string): string {
//   // First handle unencoded tags
//   let result = html.replace(/<p-image([^>]*)>src=(['"])([^'"]+)\2([^>]*)>/gi, '<img$1src=$2$3$2$4>');
//   // Then handle HTML-encoded tags
//   result = result.replace(/&lt;p-image([^&]*)&gt;src=(['"])([^'"]+)\2([^&]*)&gt;/gi, '<img$1src=$2$3$2$4>');
//   return result;
// }
function replacePImageWithImg(html: string): string {
    return html.replace(/<p-image([^>]*)src=(["'])([^"']+)\2([^>]*)>/gi, '<img$1src=$2$3$2$4>');
  }

// Define custom HTML element models
const customHTMLElementModels = {
  'p-image': HTMLElementModel.fromCustomModel({
    tagName: 'p-image',
    contentModel: HTMLContentModel.mixed,
    getUADerivedStyleFromAttributes() {
      return {
        width: '100%',
        maxWidth: '100%',
        height: 'auto',
        marginVertical: 8,
        borderRadius: 8,
      };
    },
  }),
};

// Base styles for HTML content
const baseStyle = {
  color: '#fff',
  fontSize: 16,
  lineHeight: 24,
  backgroundColor: 'transparent',
};

// Styles for specific HTML tags
const tagsStyles: MixedStyleRecord = {
    body: {
        color: '#fff',
        fontSize: 16,
        lineHeight: 24, // 1.5 × 16px for better readability
      },
      span: {
        color: '#0093fc',
        fontWeight: '600',
      },
      a: {
        color: '#1d9ffb',
        textDecorationLine: 'none',
      },
      // Text styles
      strong: {
        fontWeight: '600',
      },
      b: {
        fontWeight: '600',
      },
      i: {
        fontStyle: 'italic',
      },
      em: {
        fontStyle: 'italic',
      },
      u: {
        textDecorationLine: 'underline',
      },
      s: {
        textDecorationLine: 'line-through',
      },
      strike: {
        textDecorationLine: 'line-through',
      },
      del: {
        textDecorationLine: 'line-through',
      },
      pre: {
        backgroundColor: '#2d2d2d',
        padding: 16,
        borderRadius: 8,
        overflow: 'hidden',
        marginVertical: 12,
        lineHeight: 22, // Slightly smaller line height for code blocks
      },
      code: {
        fontFamily: 'Courier New',
        backgroundColor: '#2d2d2d',
        paddingHorizontal: 4,
        paddingVertical: 4,
        borderRadius: 4,
        fontSize: 16,
      },
      blockquote: {
        borderLeftWidth: 4,
        borderLeftColor: '#1d9ffb',
        marginVertical: 12,
        paddingLeft: 16,
        paddingVertical: 4,
        backgroundColor: 'rgba(29, 159, 251, 0.1)',
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
      },
      img: {
        width: '100%',
        height: 'auto',
        objectFit: 'contain',
        borderRadius: 8,
        marginVertical: 8,
      },
      p: {
        marginVertical: 8,
        fontSize: 16,
        lineHeight: 24,
      },
      h1: { marginVertical: 16, fontSize: 28, fontWeight: '600' },
      h2: { marginVertical: 14, fontSize: 24, fontWeight: '600' },
      h3: { marginVertical: 12, fontSize: 22, fontWeight: '600' },
      h4: { marginVertical: 10, fontSize: 20, fontWeight: '600' },
      h5: { marginVertical: 8, fontSize: 18, fontWeight: '600' },
      h6: { marginVertical: 6, fontSize: 16, fontWeight: '600' },
      ul: {
        paddingLeft: 24,
        marginVertical: 8,
      },
      ol: {
        paddingLeft: 24,
        marginVertical: 8,
      },
      li: {
        marginVertical: 4,
      },
};

interface HTMLContentProps {
  content: string;
  style?: any;
  contentWidth?: number;
}

const HTMLContent: React.FC<HTMLContentProps> = ({ 
  content, 
  style, 
  contentWidth 
}) => {
  const { width } = useWindowDimensions();
  
  if (!content) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.noContentText}>Không có nội dung.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <RenderHTML
        contentWidth={contentWidth ?? width - 40}
        source={{ html: replacePImageWithImg(content) }}
        customHTMLElementModels={customHTMLElementModels}
        tagsStyles={tagsStyles}
        baseStyle={baseStyle}
        enableExperimentalMarginCollapsing
        defaultTextProps={{ selectable: true }}
        renderersProps={{
          img: {
            enableExperimentalPercentWidth: true,
          },
        }}
        systemFonts={['Inter', 'Arial', 'sans-serif']}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  noContentText: {
    color: '#fff',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 16,
  },
});

export default HTMLContent;
