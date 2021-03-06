/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @format
 * @emails oncall+relay
 */

'use strict';

describe('SkipRedundantNodesTransform', () => {
  let RelayCompilerContext;
  let RelayParser;
  let RelayPrinter;
  let SkipRedundantNodesTransform;
  let RelayTestSchema;
  let getGoldenMatchers;

  beforeEach(() => {
    jest.resetModules();

    RelayCompilerContext = require('RelayCompilerContext');
    RelayParser = require('RelayParser');
    RelayPrinter = require('RelayPrinter');
    SkipRedundantNodesTransform = require('SkipRedundantNodesTransform');
    RelayTestSchema = require('RelayTestSchema');
    getGoldenMatchers = require('getGoldenMatchers');

    expect.extend(getGoldenMatchers(__filename));
  });

  it('skips redundant nodes', () => {
    expect('fixtures/skip-redundant-nodes-transform').toMatchGolden(text => {
      const ast = RelayParser.parse(RelayTestSchema, text);
      const context = ast.reduce(
        (ctx, node) => ctx.add(node),
        new RelayCompilerContext(RelayTestSchema),
      );
      const nextContext = SkipRedundantNodesTransform.transform(context);
      const documents = [];
      nextContext.documents().forEach(doc => {
        documents.push(RelayPrinter.print(doc));
      });
      return documents.join('\n');
    });
  });
});
