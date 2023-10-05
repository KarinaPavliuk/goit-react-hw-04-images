import { useState, useEffect } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import toast, { Toaster } from 'react-hot-toast';

import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { ImageGalleryItem } from './ImageGalleryItem/ImageGalleryItem';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';
import { getAllImages } from '../API/images';

import css from './App.module.css';

export const App = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [show, setShow] = useState(false);
  const [modalUrl, setModalUrl] = useState('');
  const [totalImages, setTotalImages] = useState(0);

  useEffect(() => {
    if (!searchQuery) return;
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const data = await getAllImages(searchQuery, page);

        if (!data.totalHits) {
          toast.error('There is no that value, please change query.');
          return;
        }

        const normalizedImages = data.hits.map(
          ({ id, webformatURL, largeImageURL, tags }) => ({
            id,
            webformatURL,
            largeImageURL,
            tags,
          })
        );

        setImages(prevImages => [...prevImages, ...normalizedImages]);
        setTotalImages(data.totalHits);
      } catch ({ message }) {
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    searchQuery && fetchImages();
  }, [searchQuery, page]);

  const handleSetSearchQuery = value => {
    if (value === searchQuery) {
      toast.error('Please change query.');
      return;
    }
    setImages([]);
    setSearchQuery(value);
    setPage(1);
    setTotalImages(0);
  };

  const handleLoadBtnClick = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleImgClick = largeImageURL => {
    setShow(true);
    setModalUrl(largeImageURL);
  };

  const closeModal = () => {
    setShow(false);
    setModalUrl('');
  };

  return (
    <div className={css.app}>
      <Searchbar submit={handleSetSearchQuery} />
      <Toaster />
      {images.length > 0 && (
        <ImageGallery>
          <ImageGalleryItem images={images} handleClick={handleImgClick} />
        </ImageGallery>
      )}
      {error && <p>{error}</p>}
      {isLoading && (
        <Loader>
          <RotatingLines
            strokeColor="#3f51b5"
            strokeWidth="5"
            animationDuration="0.75"
            width="96"
            visible={true}
          />
        </Loader>
      )}
      {images.length !== totalImages && !isLoading && (
        <Button handleClick={handleLoadBtnClick}></Button>
      )}
      {show && <Modal modalUrl={modalUrl} closeModal={closeModal} />}
    </div>
  );
};
