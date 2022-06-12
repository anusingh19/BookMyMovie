import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import Header from '../../common/header/Header';
import Heading from '../../common/heading/Heading';
import { makeStyles } from '@material-ui/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import IconButton from '@material-ui/core/IconButton';
import {
  Card,
  CardContent,
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Input,
  Checkbox,
  Button,
  createTheme,
} from '@material-ui/core';
import ReleasedMovies from './ReleasedMovies';
import './Home.css';

const useStyles = makeStyles({
  grid: {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
  },
});

const theme = createTheme();

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [artists, setArtists] = useState([]);
  const [moviename, setMoviename] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState([]);
  const [releaseStart, setReleaseStart] = useState(null);
  const [releaseEnd, setReleaseEnd] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:8085/api/v1/movies')
      .then(response => setMovies(response.data.movies));

    axios
      .get('http://localhost:8085/api/v1/genres')
      .then(response => setGenres(response.data.genres));

    axios
      .get('http://localhost:8085/api/v1/artists')
      .then(response => setArtists(response.data.artists));
  }, []);

  const onMovieNameChange = (event) => {
    setMoviename(event.target.value);
  };

  const onGenreChange = event => {
    const {
      target: { value },
    } = event;
    setSelectedGenres(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const onArtistChange = event => {
    const {
      target: { value },
    } = event;
    setSelectedArtist(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const onStartDateChange = event => {
    setReleaseStart(event.target.value);
  };

  const onEndDateChange = event => {
    setReleaseEnd(event.target.value);
  }

  const classes = useStyles();

  return (
    <Fragment>
      <Header bookShow={false} />
      <Heading />
      <ImageList className={classes.grid} cols={6} rowHeight={250}>
        {movies.map(tile => (
          <ImageListItem key={tile.id}>
            <img src={tile.poster_url} alt={tile.title} />
            <ImageListItemBar
              title={tile.title}
              actionIcon={<IconButton aria-label={`star ${tile.title}`} />}
            />
          </ImageListItem>
        ))}
      </ImageList>
      <div className='second'>
        <div className='released'>
          <ReleasedMovies movies={movies} />
        </div>
        <div className='filter'>
          <div className='cardComponent'>
            <Card>
              <CardContent>
                <InputLabel style={{ color: theme.palette.primary.light }}>
                  FIND MOVIES BY:
                </InputLabel>
                <FormControl variant="standard" style={{ width: '100%', margin: theme.spacing(1, 'auto') }}>
                  <InputLabel htmlFor="component-simple">Movie Name</InputLabel>
                  <Input id="component-simple" value={moviename} onChange={onMovieNameChange} />
                </FormControl>
                <FormControl variant="standard" style={{ width: '100%', margin: theme.spacing(1, 'auto') }}>
                  <InputLabel htmlFor="component-simple">Genres</InputLabel>
                  <Select
                    labelId='demo-mutiple-name-label'
                    id='demo-mutiple-name'
                    multiple
                    value={selectedGenres}
                    onChange={onGenreChange}
                    input={<Input label="Genres" />}
                  >
                    {genres.map(genre => (
                      <MenuItem key={genre.id} value={genre.genre}>
                        <Checkbox color='primary' />
                        {genre.genre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  style={{ width: '100%', margin: theme.spacing(1, 'auto') }}
                >
                  <InputLabel id='demo-mutiple-name-label'>Artists</InputLabel>
                  <Select
                    labelId='demo-mutiple-name-label'
                    id='demo-mutiple-name'
                    multiple
                    value={selectedArtist}
                    onChange={onArtistChange}
                    input={<Input />}
                  >
                    {artists.map(artist => (
                      <MenuItem
                        key={artist.id}
                        value={artist.first_name + ' ' + artist.last_name}
                      >
                        <Checkbox color='primary' />
                        {artist.first_name + ' ' + artist.last_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  style={{ width: '100%', margin: theme.spacing(1, 'auto') }}
                >
                  <TextField
                    name='Release Date Start'
                    id='standard-basic'
                    type='date'
                    label='Release Date Start'
                    value={releaseStart}
                    onChange={onStartDateChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </FormControl>
                <FormControl
                  style={{ width: '100%', margin: theme.spacing(1, 'auto') }}
                >
                  <TextField
                    name='Release Date End'
                    id='standard-basic'
                    type='date'
                    label='Release Date End'
                    value={releaseEnd}
                    onChange={onEndDateChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </FormControl>
                <div>
                  <FormControl
                    style={{ width: '100%', margin: theme.spacing(1, 'auto') }}
                  >
                    <Button variant='contained' name='Apply' color='primary'>
                      Apply
                    </Button>
                  </FormControl>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
