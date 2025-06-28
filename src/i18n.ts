import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

const en = {
  common: {
    ok: 'OK',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    success: 'Success',
    error: 'Error',
  },
  auth: {
    connection_error: 'Connection Error',
    connection_error_details: 'Could not connect to the server. Please ensure Supabase is running.',
    fill_all_fields: 'Please fill in all fields',
    invalid_login_credentials: 'The email or password you entered is incorrect. Please try again.',
    login_failed_title: 'Login Failed',
    email_placeholder: 'your@email.com',
    password_placeholder: 'Enter your password',
    login_button: 'Log In',
    go_to_register_prompt: "Don't have an account?",
    sign_up_link: 'Sign Up',
    create_your_account: 'Create Your Account',
    register_button: 'Register',
    first_name_placeholder: 'First Name',
    last_name_placeholder: 'Last Name',
    confirm_password_placeholder: 'Confirm Password',
    passwords_do_not_match: 'Passwords do not match',
    signup_failed_check_logs: 'Signup failed. Please check logs.',
    signup_successful_verify_email: 'Signup successful! Please check your email to verify your account.',
    already_have_account: 'Already have an account?',
    login_link: 'Log In'
  },
  company: {
    one_last_step: 'One last step!',
    tell_us_your_company_name: 'Tell us your company name to finish setup.',
    enter_company_name: 'Please enter a company name.',
    company_created_successfully: 'Company created successfully!',
    create_failed: 'Failed to create company.',
    create_and_continue: 'Create and Continue'
  },
};

const me = {
  ...en, // Start by copying all english translations
  common: {
    ...en.common,
    ok: 'U redu',
    cancel: 'Otkaži',
    save: 'Sačuvaj',
    delete: 'Obriši',
    edit: 'Uredi',
    add: 'Dodaj',
    success: 'Uspeh',
    error: 'Greška',
  },
  auth: {
    ...en.auth,
    connection_error: 'Greška u Konekciji',
    connection_error_details: 'Nije moguće povezati se sa serverom. Provjerite da li je Supabase pokrenut.',
    fill_all_fields: 'Molimo Vas, popunite sva polja',
    invalid_login_credentials: 'Email ili lozinka koju ste unijeli nijesu ispravni. Molimo Vas, pokušajte ponovo.',
    login_failed_title: 'Prijava Neuspešna',
    email_placeholder: 'vasa@email.adresa',
    password_placeholder: 'Unesite Vašu lozinku',
    login_button: 'Prijavi se',
    go_to_register_prompt: 'Nemate nalog?',
    sign_up_link: 'Registrujte se',
    create_your_account: 'Kreirajte Vaš Nalog',
    register_button: 'Registruj se',
    first_name_placeholder: 'Ime',
    last_name_placeholder: 'Prezime',
    confirm_password_placeholder: 'Potvrdite lozinku',
    passwords_do_not_match: 'Lozinke se ne poklapaju',
    signup_failed_check_logs: 'Registracija neuspešna. Proverite logove.',
    signup_successful_verify_email: 'Registracija uspešna! Molimo proverite email da verifikujete nalog.',
    already_have_account: 'Već imate nalog?',
    login_link: 'Prijavite se'
  },
  company: {
    ...en.company,
    one_last_step: 'Još samo jedan korak!',
    tell_us_your_company_name: 'Recite nam ime vaše kompanije da završite podešavanje.',
    enter_company_name: 'Molimo unesite ime kompanije.',
    company_created_successfully: 'Kompanija je uspešno kreirana!',
    create_failed: 'Neuspešno kreiranje kompanije.',
    create_and_continue: 'Kreiraj i nastavi'
  },
};


const resources = {
  en: {
    translation: en,
  },
  me: {
    translation: me,
  },
};

i18next
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: getLocales()[0].languageCode,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, 
    },
    react: {
      useSuspense: true,
    },
  });

export default i18next;