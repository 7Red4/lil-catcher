import { InjectionKey } from 'vue';
import rules from './injections/rules';

export const _rules = Symbol() as InjectionKey<typeof rules>;

export default function (app) {
  app.provide(_rules, rules);
}
