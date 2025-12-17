/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/
import { vi } from 'vitest';
import * as yaml from 'js-yaml';

/**
 * Mock KubeConfig class for testing.
 */
class KubeConfig {
  clusters = [];
  users = [];
  contexts = [];
  currentContext = '';

  loadFromString(yamlString) {
    const config = yaml.load(yamlString);
    this.clusters =
      config.clusters?.map(c => ({
        name: c.name,
        server: c.cluster?.server,
        skipTLSVerify: c.cluster?.['insecure-skip-tls-verify'] ?? false,
        caFile: c.cluster?.['certificate-authority'],
        caData: c.cluster?.['certificate-authority-data'],
      })) || [];
    this.users =
      config.users?.map(u => ({
        name: u.name,
        certFile: u.user?.['client-certificate'],
        certData: u.user?.['client-certificate-data'],
        keyFile: u.user?.['client-key'],
        keyData: u.user?.['client-key-data'],
        token: u.user?.token,
      })) || [];
    this.contexts = config.contexts?.map(c => ({ name: c.name, ...c.context })) || [];
    this.currentContext = config['current-context'] || '';
  }

  loadFromOptions(options) {
    this.clusters = options.clusters || [];
    this.users = options.users || [];
    this.contexts = options.contexts || [];
    this.currentContext = options.currentContext || '';
  }

  exportConfig() {
    return JSON.stringify({
      clusters: this.clusters.map(c => ({ name: c.name, cluster: { server: c.server } })),
      users: this.users.map(u => ({ name: u.name })),
      contexts: this.contexts.map(c => ({
        name: c.name,
        context: { cluster: c.cluster, user: c.user, namespace: c.namespace },
      })),
      'current-context': this.currentContext,
    });
  }

  setCurrentContext(contextName) {
    this.currentContext = contextName;
  }

  getCurrentContext() {
    return this.currentContext;
  }

  getContexts() {
    return this.contexts;
  }

  getClusters() {
    return this.clusters;
  }

  getUsers() {
    return this.users;
  }

  getCluster(clusterName) {
    return this.clusters.find(c => c.name === clusterName);
  }

  getUser(userName) {
    return this.users.find(u => u.name === userName);
  }

  getContextObject(contextName) {
    return this.contexts.find(c => c.name === contextName);
  }
}

// Make loadFromFile a mock function on the prototype
KubeConfig.prototype.loadFromFile = vi.fn();

module.exports = {
  KubeConfig,
};

