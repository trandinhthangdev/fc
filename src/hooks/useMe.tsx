import {useEffect, useState} from 'react';
import StorageService from '../db/StorageService';
import {useAppSelector} from '../redux/store';
import {useDispatch} from 'react-redux';
import {setMe} from '../redux/features/userSlice';

export const useMe = () => {
  const dispatch = useDispatch();
  const {me} = useAppSelector(state => state.user);

  useEffect(() => {
    if (me === undefined) getMeInit();
  }, []);
  const getMeInit = async () => {
    try {
      const storage = StorageService.getInstance();
      const {data: initMe}: any = await storage.getItem('me');
      if (initMe) {
        updateMe(initMe);
      } else {
        updateMe(null);
      }
    } catch (e) {
      updateMe(null);
    }
  };
  const updateMe = (data: any) => {
    dispatch(setMe(data));
  };
  return {
    me,
    updateMe,
  };
};
