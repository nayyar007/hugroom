import { useState, useEffect} from "react";

export const useLiveLikeInit = ({endpoint, clientId} : any) => {
    const [userProfile, setUserProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      import('@livelike/engagementsdk').then((LiveLike) => {

        const localStorageStrategy = isLocalStorageAvailable() ? undefined : inMemStorageStrategy;

        (window as any).Livelike = LiveLike.default
        LiveLike.default.init({
          endpoint,
          clientId,
          storageStrategy:localStorageStrategy
        }).then((profile: any) => {
          setIsLoading(false);
          setUserProfile(profile);
          applyLocalization()
        });
       });
    }, []);

    return { userProfile, isLoading };
};
  
const applyLocalization = () => {
    (window as any).LiveLike.applyLocalization({
      en: {
        "widget.quiz.voteButton.label": "SUBMIT",
        "widget.quiz.votedText": "SUBMITTED!",
        "widget.slider.voteButton.label": "SUBMIT",
        "widget.slider.votedText": "SUBMITTED!",
      }
    });
}

function isLocalStorageAvailable() {
  try {
    localStorage.setItem('testKey', 'testValue');
    localStorage.removeItem('testKey');
    return true; 
  } catch (error) {
    console.log('localStorage not availble')
    return false
  }
}

let _storage: any;

export const inMemStorageStrategy = {
  get() {
    return _storage;
  },
  set(storage: any) {
    _storage = storage;
  },
};