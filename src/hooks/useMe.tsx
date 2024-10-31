import {useEffect, useState} from 'react';
import StorageService from '../db/StorageService';

export const useMe = () => {
  const [me, setMe] = useState<any>(undefined);
  useEffect(() => {
    getMeInit();
  }, []);
  const getMeInit = async () => {
    try {
      const storage = StorageService.getInstance();
      const {data: initMe} = await storage.getItem('me');
      if (initMe) {
        setMe(initMe);
      } else {
        setMe(null);
      }
    } catch (e) {
      setMe(null);
    }
  };
  return {
    me,
    setMe,
  };
};
