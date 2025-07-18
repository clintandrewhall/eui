/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { css } from '@emotion/react';

import { isEuiThemeRefreshVariant, UseEuiTheme } from '../../services';
import { logicalCSS } from '../../global_styling';
import { euiMarkdownEditorVariables } from './markdown_editor.styles';
import { euiFormControlInvalidStyles } from '../form/form.styles';

export const euiMarkdownEditorDropZoneStyles = (
  euiThemeContext: UseEuiTheme
) => {
  const { euiTheme } = euiThemeContext;
  const isRefreshVariant = isEuiThemeRefreshVariant(
    euiThemeContext,
    'formVariant'
  );
  const { minHeight } = euiMarkdownEditorVariables(euiThemeContext);

  return {
    euiMarkdownEditorDropZone: css`
      position: relative;
      display: flex;
      flex-direction: column;
      ${logicalCSS('min-height', minHeight)}
    `,
    isDragging: css`
      .euiMarkdownEditorFooter,
      .euiMarkdownEditorTextArea {
        background-color: ${isRefreshVariant
          ? euiTheme.colors.backgroundBasePrimary
          : euiTheme.colors
              .backgroundTransparentPrimary} !important; /* stylelint-disable-line declaration-no-important */
      }
    `,
    isDraggingError: css`
      .euiMarkdownEditorFooter,
      .euiMarkdownEditorTextArea {
        background-color: ${isRefreshVariant
          ? euiTheme.colors.backgroundBaseDanger
          : euiTheme.colors
              .backgroundTransparentDanger} !important; /* stylelint-disable-line declaration-no-important */
      }
    `,
    hasError: css`
      .euiMarkdownEditorTextArea {
        /* stylelint-disable-next-line declaration-no-important */
        --euiFormControlStateColor: ${euiTheme.colors.danger};
        background-size: 100% 100%;

        ${isRefreshVariant && euiFormControlInvalidStyles(euiThemeContext)}
      }
    `,
    euiMarkdownEditorDropZone__input: css`
      position: absolute;
      inset: 0;
      opacity: 0;
      overflow: hidden;

      &:hover {
        cursor: pointer;
      }

      &:hover:disabled {
        cursor: not-allowed;
      }
    `,
  };
};
