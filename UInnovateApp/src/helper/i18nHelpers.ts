import { translation } from "../redux/LanguageSelectionSlice";
import { KeyProps, LanguageProps, getTranslationsByLanguage, i18nTranslationsProps } from "../virtualmodel/I18nDataAccessor";


export class I18n {

    public language: string = "en";
    public labelKeyCode: KeyProps[] = [];
    public translations:i18nTranslationsProps[]= [];

    public translationList: translation[]=[];
    
    constructor(_translations: translation[], lang:string = "en") {
        this.translationList = _translations;
        this.language = lang;
    }

    static reloadI18Values(lang: string) {

        //load translation values
        const gettranslations = getTranslationsByLanguage(lang);
        return gettranslations
    }

    setTranslationList(_translations: translation[]) {
        this.translationList = _translations;
    }

    logValues() {
        console.log(this.translations);
    }
    setLanguage(lang: string){
        return new Promise((res, rej) => {
            var trans = this.translationList.filter(
                (t) => t.languageCode == lang
            );
            if(trans.length > 0)
                this.translations = trans[0].values;
            res(true)
        });
    }
    get(key: string, defaultValue: string) {
        const translation = this.translations ? this.translations.filter((elem) =>
            key === elem.key_code.toString()
        ): [];
        if(translation.length > 0 ) {
            if(translation[0].value != "")
                return translation[0].value;
            else
            return defaultValue;
        }
        return defaultValue;
    }

}

export const i18n = new I18n();