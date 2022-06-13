import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import Header from '../../common/header/Header';
import Heading from '../../common/heading/Heading';
import { makeStyles } from '@material-ui/core/styles';
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
  ListItemText,
  Typography,
} from '@material-ui/core';
import ReleasedMovies from './ReleasedMovies';
import './Home.css';

const Home = () => {

  const useStyles = makeStyles((theme) => ({
    grid: {
      flexWrap: 'nowrap',
      transform: 'translateZ(0)',
    },
    root: {
      float: "right",
      margin: theme.spacing(1, 'auto'),
      minWidth: 240,
      maxWidth: 240,
    },
    title: {
      color: theme.palette.primary.light,
    },
    withMargin: {
      marginBottom: theme.spacing(1, 'auto'),
      marginTop: theme.spacing(1, 'auto')
    },
    button: {
      width: "100%"
    }
  }));

  const classes = useStyles();

  const [allMovies, setAllMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [artists, setArtists] = useState([]);
  const [filter, setFilter] = useState(null);
  const [values, setValues] = useState({
    movieName: "",
    genre: [],
    artist: [],
    from: "",
    to: "",
  });

  useEffect(() => {
    const getMovies = async () => {
      try {
        let response = await fetch(
          'http://localhost:8085/api/v1/movies?page=1&limit=100000'
        );
        let result = await response.json();
        setAllMovies(result.movies);
        response = await fetch('http://localhost:8085/api/v1/genres');
        result = await response.json();
        setGenres(result.genres.map((element) => element.description));
        response = await fetch('http://localhost:8085/api/v1/artists');
        result = await response.json();
        setArtists(
          result.artists.map(
            (element) =>
              element.first_name + " " + element.last_name
          )
        );
      } catch (_) { }
    };
    getMovies();
  }, []);

  const releasedMoviesAll = allMovies.filter(
    (movie) => movie.status.toLowerCase() === "released"
  ) || [];

  const filterHasArtists = (artists, movie) => {
    const makeFullName = (first, last) =>
      (first + " " + last).toLowerCase();

    let found = false;
    artists.forEach((artist) => {
      if (
        movie.artists.find((element) =>
          makeFullName(element).includes(makeFullName(artist))
        ) !== undefined
      )
        found = true;
    });

    return found;
  };

  const filterHasGenre = (genres, movie) => {
    let found = false;
    genres.forEach((genre) => {
      if (
        movie.genres.find((element) =>
          element.toLowerCase().includes(genre.toLowerCase())
        ) !== undefined
      )
        found = true;
    });

    return found;
  };

  // assuming the format from database is still YYYY-MM-DD
  const dateInRange = (dateCheck, dateFrom, dateTo) => {
    let date = new Date(dateCheck);

    if (
      dateFrom !== undefined &&
      dateFrom !== null &&
      dateFrom.toLowerCase().trim() !== ""
    ) {
      let from = new Date(dateFrom);
      if (date < from) return false;
    }

    if (
      dateTo !== undefined &&
      dateTo !== null &&
      dateTo.toLowerCase().trim() !== ""
    ) {
      let to = new Date(dateTo);
      if (date > to) return false;
    }

    return true;
  };

  const releasedMovies =
    filter === null
      ? releasedMoviesAll
      : releasedMoviesAll.filter(
        (movie) =>
          (filter.movieName === null ||
            filter.movieName.trim() === "" ||
            movie.title
              .toLowerCase()
              .includes(filter.movieName)) &&
          (filter.artist === null ||
            filter.artist.length === 0 ||
            filterHasArtists(filter.artist, movie)) &&
          (filter.genre === null ||
            filter.genre.length === 0 ||
            filterHasGenre(filter.genre, movie)) &&
          dateInRange(movie.release_date, filter.from, filter.to)
      );

  const onFilterCallback = () => {
    setFilter(values);
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 11.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  return (
    <Fragment>
      <Header bookShow={false} />
      <Heading />
      <ImageList className={classes.grid} cols={6} rowHeight={250}>
        {allMovies.map(tile => (
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
          <ReleasedMovies movies={releasedMovies} />
        </div>
        <div className='filter'>
          <div className='cardComponent'>
            <Card className={classes.root}>
              <CardContent>
                <Typography gutterBottom component="h3" className={classes.title}>
                  FIND MOVIES BY:
                </Typography>

                <FormControl fullWidth className={classes.withMargin}>
                  <InputLabel htmlFor="movieName">Movie Name</InputLabel>
                  <Input
                    id="movieName"
                    value={values.movieName}
                    onChange={handleChange("movieName")}
                  />
                </FormControl>

                <FormControl fullWidth className={classes.withMargin}>
                  <InputLabel id="genres-label">Genres</InputLabel>
                  <Select
                    labelId="genres-label"
                    id="genres"
                    multiple
                    value={values.genre}
                    onChange={handleChange("genre")}
                    input={<Input />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                  >
                    {genres.map((element, index) => (
                      <MenuItem value={element} key={index}>
                        <Checkbox checked={values.genre.indexOf(element) > -1} />
                        <ListItemText primary={element} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth className={classes.withMargin}>
                  <InputLabel id="artist-label">Artists</InputLabel>
                  <Select
                    labelId="artist-label"
                    id="artist"
                    multiple
                    value={values.artist}
                    onChange={handleChange("artist")}
                    input={<Input />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                  >
                    {artists.map((element, index) => (
                      <MenuItem value={element} key={index}>
                        <Checkbox checked={values.artist.indexOf(element) > -1} />
                        <ListItemText primary={element} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth className={classes.withMargin}>
                  <TextField
                    id="startDate"
                    label="Release Date Start"
                    type="date"
                    defaultValue=""
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={handleChange("from")}
                  />
                </FormControl>
                <FormControl fullWidth className={classes.withMargin}>
                  <TextField
                    id="endDate"
                    label="Release Date End"
                    type="date"
                    defaultValue=""
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={handleChange("to")}
                    format="DD-MM-YYYY"
                  />
                </FormControl>
                <br />
                <br />
                <br />
                <Button variant="contained" color="primary" disableElevation onClick={onFilterCallback}>
                  APPLY
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
