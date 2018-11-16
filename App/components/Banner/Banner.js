// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import React from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native';

import * as theme from '../../utils/theme';

export const Banner = ({ asTouchable, children, elevated, onClick, style }) => {
  const Wrapper = asTouchable ? TouchableHighlight : View;

  return (
    <Wrapper
      onPress={asTouchable ? onClick : undefined}
      style={[
        styles.container,
        elevated === true ? theme.elevatedLevel1 : null,
        elevated === 'very' ? theme.elevatedLevel2 : null
      ]}
      underlayColor={asTouchable ? theme.primaryColor : undefined} // https://github.com/facebook/react-native/issues/11834
    >
      <View
        pointerEvents={asTouchable ? 'none' : 'auto'}
        style={[styles.content, style]}
      >
        {children}
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.primaryColor
  },
  content: {
    ...theme.withPadding,
    alignItems: 'center',
    flexDirection: 'row',
    height: 48
  }
});
