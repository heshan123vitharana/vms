import { ReactNode } from 'react';

// third-party
import { IntlProvider } from 'react-intl';

// English messages only
import enMessages from 'utils/locales/en.json';

// ==============================|| LOCALIZATION (English only) ||============================== //

interface Props {
  children: ReactNode;
}

export default function Locales({ children }: Props) {
  return (
    <IntlProvider locale="en" defaultLocale="en" messages={enMessages}>
      {children}
    </IntlProvider>
  );
}
