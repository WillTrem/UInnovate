import { KeyProps, LanguageProps, getTranslationsByLanguage, i18nTranslationsProps } from "../virtualmodel/I18nDataAccessor";


export class I18n {

    public languages: LanguageProps[] = [];
    public labelKeyCode: KeyProps[] = [];
    public translations:i18nTranslationsProps[]= [];
    constructor(_lang: string = "en") {
        this.reloadI18Values(_lang);
    }

    reloadI18Values(lang: string) {

        //load translation values
        const gettranslations = getTranslationsByLanguage(lang);
        return gettranslations.then((rows) => {
            this.translations = rows;
        })
    }

    logValues() {
        console.log(this.translations);
    }

    get(key: string) {
        const translation = this.translations ? this.translations.filter((elem) =>
            key === elem.key_code.toString()
        ): [];
        console.log("translation: ", translation)
        if(translation.length > 0 ) {
            if(translation[0].value != "")
                return translation[0].value;
            else
            return translation[0].key_code;
        }
        return null;

    }


}

export const i18n = new I18n();