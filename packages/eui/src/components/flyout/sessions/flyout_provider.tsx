/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { createContext, useContext, useReducer } from 'react';

import { EuiFlyout, EuiFlyoutChild } from '../index';

import { flyoutReducer, initialFlyoutState } from './flyout_reducer';
import {
  EuiFlyoutSessionAction,
  EuiFlyoutSessionHistoryState,
  EuiFlyoutSessionProviderComponentProps,
  EuiFlyoutSessionRenderContext,
} from './types';

interface FlyoutSessionContextProps {
  state: EuiFlyoutSessionHistoryState;
  dispatch: React.Dispatch<EuiFlyoutSessionAction>;
  onUnmount?: EuiFlyoutSessionProviderComponentProps['onUnmount'];
}

const EuiFlyoutSessionContext = createContext<FlyoutSessionContextProps | null>(
  null
);

/**
 * Accesses the state data and dispatch function from the context of EuiFlyoutSessionProvider
 * Use this if you need to debug the state or need direct access to the dispatch function, otherwise use useEuiFlyoutSession hook.
 */
export const useEuiFlyoutSessionContext = () => {
  const context = useContext(EuiFlyoutSessionContext);
  if (!context) {
    throw new Error(
      'useEuiFlyoutSessionContext must be used within a EuiFlyoutSessionProvider'
    );
  }
  return context;
};

/**
 * FlyoutProvider is a component that provides a context for Flyout components.
 * It is used to manage the state of the Flyout and its child.
 * It also renders the Flyout and FlyoutChild components.
 *
 * @param children - The children of the FlyoutProvider component.
 * @param renderMainFlyoutContent - A function that renders the content of the main Flyout.
 * @param renderChildFlyoutContent - A function that renders the content of the child Flyout.
 * @returns The FlyoutProvider component.
 */
export const EuiFlyoutSessionProvider: React.FC<
  EuiFlyoutSessionProviderComponentProps
> = ({
  children,
  renderMainFlyoutContent,
  renderChildFlyoutContent,
  onUnmount,
}) => {
  const [state, dispatch] = useReducer(flyoutReducer, initialFlyoutState);
  const { activeFlyoutGroup } = state;

  const handleClose = () => {
    dispatch({ type: 'CLOSE_SESSION' });
  };

  const handleCloseChild = () => {
    dispatch({ type: 'CLOSE_CHILD_FLYOUT' });
  };

  let mainFlyoutContentNode: React.ReactNode = null;
  let childFlyoutContentNode: React.ReactNode = null;

  if (activeFlyoutGroup) {
    const renderContext: EuiFlyoutSessionRenderContext = {
      activeFlyoutGroup,
      meta: activeFlyoutGroup.meta,
    };
    mainFlyoutContentNode = renderMainFlyoutContent(renderContext);

    if (activeFlyoutGroup.isChildOpen && renderChildFlyoutContent) {
      childFlyoutContentNode = renderChildFlyoutContent(renderContext);
    } else if (activeFlyoutGroup.isChildOpen && !renderChildFlyoutContent) {
      console.warn(
        'EuiFlyoutSessionProvider: A child flyout is open, but renderChildFlyoutContent was not provided.'
      );
    }
  }

  const config = activeFlyoutGroup?.config;
  const flyoutPropsMain = config?.mainFlyoutProps || {};
  const flyoutPropsChild = config?.childFlyoutProps || {};

  return (
    <EuiFlyoutSessionContext.Provider value={{ state, dispatch, onUnmount }}>
      {children}
      {activeFlyoutGroup?.isMainOpen && (
        <EuiFlyout
          onClose={handleClose}
          size={config?.mainSize}
          ownFocus={!activeFlyoutGroup.isChildOpen}
          {...flyoutPropsMain}
        >
          {mainFlyoutContentNode}
          {activeFlyoutGroup.isChildOpen && childFlyoutContentNode && (
            <EuiFlyoutChild
              onClose={handleCloseChild}
              size={config?.childSize}
              {...flyoutPropsChild}
            >
              {childFlyoutContentNode}
            </EuiFlyoutChild>
          )}
        </EuiFlyout>
      )}
    </EuiFlyoutSessionContext.Provider>
  );
};
