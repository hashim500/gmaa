import React, { useState, useEffect } from 'react';
import { TranslationDict } from '../../i18n/translations';
import { CVTemplateSelector } from './cv/CVTemplateSelector';
import { ModernCVEditor } from './cv/ModernCVEditor';
import { TableCVEditor } from './cv/TableCVEditor';
import { ClassicAcademicCVEditor } from './cv/ClassicAcademicCVEditor';

export type CVTemplate = 'modern' | 'table' | 'classic';

export interface CVBuilderToolProps {
  t: TranslationDict;
  onBack: () => void;
  initialTemplate?: CVTemplate;
  onTemplateChange?: (template: CVTemplate) => void;
}

export const CVBuilderTool: React.FC<CVBuilderToolProps> = ({
  t,
  onBack,
  initialTemplate,
  onTemplateChange,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate | null>(
    initialTemplate || null
  );

  useEffect(() => {
    if (initialTemplate) {
      setSelectedTemplate(initialTemplate);
    }
  }, [initialTemplate]);

  const handleSelectTemplate = (tpl: CVTemplate) => {
    setSelectedTemplate(tpl);
    onTemplateChange?.(tpl);
  };

  const handleBackToSelector = () => {
    setSelectedTemplate(null);
  };

  if (!selectedTemplate) {
    return (
      <CVTemplateSelector
        onSelectTemplate={handleSelectTemplate}
        onBack={onBack}
      />
    );
  }

  if (selectedTemplate === 'modern') {
    return (
      <ModernCVEditor
        t={t}
        onBackToSelector={handleBackToSelector}
        onBackToHome={onBack}
      />
    );
  }

  if (selectedTemplate === 'table') {
    return (
      <TableCVEditor
        t={t}
        onBackToSelector={handleBackToSelector}
        onBackToHome={onBack}
      />
    );
  }

  if (selectedTemplate === 'classic') {
    return (
      <ClassicAcademicCVEditor
        t={t}
        onBackToSelector={handleBackToSelector}
        onBackToHome={onBack}
      />
    );
  }

  return null;
};
