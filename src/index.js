require('font-awesome/css/font-awesome.css');
require('./styles/index.css');
require('jquery-lazyload');

jQuery(document).ready(function($) {

  const template = require('./templates/index.pug');
  $('body').prepend(template());

  const setDefalutImage = function() {
    $('#pic').attr('src', require('./images/default.png'));
  };

  let listStatus = 0,
    audio = document.getElementById('music'),
    isPlaying = false,
    currentMusic = 0,
    prevMusic = -1,
    repeat = 2,
    relist = ['fa-random', 'fa-refresh', 'fa-retweet'],
    retitle = ['Random', 'Cycle', 'Order'],
    playlist = null;

  setDefalutImage();

  if (localStorage.currentMusic)
    currentMusic = parseInt(localStorage.currentMusic);

  $('.control .repeat i').removeClass()
    .addClass('fa')
    .addClass(relist[repeat])
    .attr('title', retitle[repeat]);

  playlist = require('./data/playlist.json');

  if (currentMusic >= playlist.length) {
    currentMusic = localStorage.currentMusic = 0;
    window.location.reload();
  }

  for (let i = 0; i < playlist.length; i++) {
    const item = playlist[i];
    $('.play-list ul').append('<li class="item' + i + '">' + item.title + '</li>');
  }

  const loadMusic = function(i) {
    currentMusic = localStorage.currentMusic = i;
    const item = playlist[i];
    audio.setAttribute('src', item.mp3);
    setDefalutImage();
    $('#pic').attr('data-original', item.cover).lazyload({
      effect: 'fadeIn'
    });
    $('#wrap .title h1').html(item.title);
    $('#wrap .title h2').html(item.artist);
    $('.play-list ul li').removeClass('playing').eq(i).addClass('playing');
    if (isPlaying) {
      play();
    }
    console.log('Song Title: ' + item.title + ' Song Artist: ' + item.artist);
    console.log('Current Music: ' + currentMusic + ' Repeat: ' + repeat);
  };

  loadMusic(currentMusic);

  const changeMusic = function(i) {
    $('#wrap .progress .current').css({
      'width': 0
    });
    loadMusic(i);
  };

  const randomNum = function(min, max) {
    return Math.floor(parseInt(min) + Math.random() * parseInt(max - min));
  };

  const autoChange = function() {
    let nextMusic = 0;
    switch (repeat) {
      case 0:
        prevMusic = currentMusic;
        nextMusic = randomNum(0, playlist.length);
        changeMusic(nextMusic);
        break;
      case 1:
        audio.currentTime = 0.0;
        play();
        break;
      case 2:
        if (currentMusic == playlist.length - 1) {
          changeMusic(0);
        } else {
          changeMusic(parseInt(currentMusic) + 1);
        }
        break;
    }
  };

  audio.ontimeupdate = function(event) {
    const ratio = audio.currentTime / audio.duration * 100;
    $('#wrap .progress .current').css({
      'width': ratio + '%'
    });
    if (parseInt(ratio) == 100) {
      $('.buttons .next').click();
    }
  };

  const play = function() {
    audio.play();
    $('.album').addClass('playing');
    $('.start i').addClass('playing').removeClass('fa-play').addClass('fa-pause');
    isPlaying = true;
  };

  const pause = function() {
    audio.pause();
    $('.album').removeClass('playing');
    $('.start i').removeClass('playing').removeClass('fa-pause').addClass('fa-play');
    isPlaying = false;
  };

  const next = function() {
    if (repeat == 0) {
      prevMusic = currentMusic;
      nextMusic = randomNum(0, playlist.length);
      changeMusic(nextMusic);
    } else if (currentMusic == playlist.length - 1) {
      changeMusic(0);
    } else {
      changeMusic(parseInt(currentMusic) + 1);
    }
  };

  const prev = function() {
    if (repeat == 0 && prevMusic != -1) {
      changeMusic(prevMusic);
      prevMusic = randomNum(0, playlist.length);
    } else if (currentMusic == 0) {
      changeMusic(playlist.length - 1);
    } else {
      changeMusic(parseInt(currentMusic) - 1);
    }
  };

  $('.start i').on('click', function() {
    if ($(this).hasClass('playing')) {
      pause();
    } else {
      play();
    }
  });

  $('.buttons .prev').on('click', function() {
    prev();
  });

  $('.buttons .next').on('click', function() {
    next();
  });

  $('.progress').on('click', function(event) {
    const distance = event.pageX - $(this).offset().left;
    audio.currentTime = distance * (audio.duration / $(this).width());
  });

  $('.play-list ul li').on('click', function() {
    if (!$(this).hasClass('playing')) {
      const className = $(this).attr('class');
      const num = parseInt(className.substr(4));
      changeMusic(num);
    }
    play();
  });

  $('.list-button').on('click', function() {
    const listWidth = $('#wrap .play-list ul').width();
    const icon = $(this).find('i');
    if (!listStatus) {
      $(this).animate({
        marginLeft: listWidth + 30
      }, 300);
      $('#wrap .play-list ul').animate({
        marginLeft: 0
      }, 300);
      icon.removeClass('fa-bars').addClass('fa-close');
      listStatus = true;
    } else {
      $(this).animate({
        marginLeft: 10
      }, 300);
      $('#wrap .play-list ul').animate({
        marginLeft: -400
      }, 300);
      icon.removeClass('fa-close').addClass('fa-bars');
      listStatus = false;
    }
  });

  $(document).on('click', function(event) {
    if ($(event.target).closest('.play-list').length == 0 && listStatus)
      $('.list-button').click();
  });

  $(document).on('keydown', function(event) {
    if (!event)
      event = window.event;
    if (event.keyCode == 32) {
      $('.start i').click();
    } else if (event.keyCode == 39) {
      next();
    } else if (event.keyCode == 37) {
      prev();
    }
  });
});