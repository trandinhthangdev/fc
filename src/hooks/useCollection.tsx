import axios from 'axios';
import {useEffect, useState} from 'react';
import {COLLECTION_PAGE_URL} from '../utils/constants';
import {useDispatch} from 'react-redux';
import {addPhotos, setCollection} from '../redux/features/collectionSlice';
import {useAppSelector} from '../redux/store';
import db from './../db/Database'; // Assuming your singleton is saved in Database.ts
import StorageService from '../db/StorageService';
import {getRandomItems} from '../utils/functions';
import {ETabView} from '../screens/Collection';
interface Page {
  id: number;
  url: string;
}
const PHOTO_PER_PAGE = 20;
interface useCollectionProps {
  type: ETabView;
}
export const useCollection = ({type}: useCollectionProps) => {
  const [pages, setPages] = useState<Page[] | null>(null);
  const [pagesFetched, setPagesFetched] = useState<Page[] | null>(null);
  const {collection, currentPhoto} = useAppSelector(state => state.collection);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    setIsLoading(true);
    dispatch(setCollection([]));
    getCollectionInDB();
  }, []);
  const getCollectionInDB = async () => {
    const data =
      type === ETabView.tab_all
        ? await db.getRandomPhotos(PHOTO_PER_PAGE, [])
        : await db.getPhotosLovedAt(PHOTO_PER_PAGE, []);
    dispatch(setCollection(data));
    if (data.length === 0) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } else {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getPageFetched();
  }, []);
  const getPageFetched = async () => {
    const storage = StorageService.getInstance();
    const data = await storage.getItem('pagesFetched');
    const pageFetchedInit = data == null ? [] : data;
    setPagesFetched(pageFetchedInit);
    getPages(pageFetchedInit);
  };

  useEffect(() => {
    getCollections();
  }, [pages]);

  const getPages = pageFetchedInit => {
    axios.get(`${COLLECTION_PAGE_URL}?time=${Date.now()}`).then(res => {
      const pagesFilter = res.data.filter(
        item => !pageFetchedInit?.some(itemP => itemP.id == item.id),
      );
      setPages(pagesFilter);
    });
  };

  useEffect(() => {
    (async () => {
      const storage = StorageService.getInstance();
      await storage.setItem('pagesFetched', pagesFetched);
    })();
  }, [pagesFetched]);

  const getCollections = async () => {
    if (pages === null) return;
    let index = 0;
    for (const page of pages) {
      const res = await axios.get(`${page.url}?time=${Date.now()}`);
      if (res.data?.length) {
        const data = res.data.map(item => ({
          url: item.id,
          width: item.width,
          height: item.height,
        }));
        if (index === 0 && collection.length === 0) {
          if (collection.length === 0)
            dispatch(setCollection(getRandomItems(data, PHOTO_PER_PAGE)));
        }
        try {
          const NUMBER_PER_PAGE = 300;
          const nbPages = Math.round(data.length / NUMBER_PER_PAGE);
          for (let index = 0; index < nbPages; index++) {
            await db.addMultiplePhotos(
              data.slice(
                index * NUMBER_PER_PAGE,
                (index + 1) * NUMBER_PER_PAGE,
              ),
            );
          }
          setPagesFetched(prev =>
            prev?.some(item => item.id === page.id)
              ? prev.filter(item => item.id !== page.id)
              : [...(prev ?? []), page],
          );
        } catch (e) {
          console.log('e', e);
        }
        index += 1;
      }
    }
  };
  const loadMore = async () => {
    setIsLoading(true);
    const data =
      type === ETabView.tab_all
        ? await db.getRandomPhotos(
            PHOTO_PER_PAGE,
            collection.map(item => item.url),
          )
        : await db.getPhotosLovedAt(
            PHOTO_PER_PAGE,
            collection.map(item => item.url),
          );
    dispatch(addPhotos(data));
    setIsLoading(false);
  };

  return {
    pages,
    collection,
    currentPhoto,
    loadMore,
    isLoading,
  };
};
