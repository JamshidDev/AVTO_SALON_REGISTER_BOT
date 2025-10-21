import { I18n } from '@grammyjs/i18n';

const i18n = new I18n({
  defaultLocale: "uz",
  useSession: true,
  directory: 'locales'
});

export { i18n };
