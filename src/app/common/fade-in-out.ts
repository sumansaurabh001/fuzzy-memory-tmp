

import {animation, style, animate, trigger, transition, useAnimation}
  from '@angular/animations';


export const fadeInAnimation = animation([
    style({opacity:0}),
    animate("{{delay}}",style({opacity:1}))
  ],
  {params: {delay: '1000ms'}});

export const fadeOutAnimation = animation(
  animate("{{delay}}", style({opacity:0})),
  {params: {delay: '1000ms'}}
);


export const fadeIn = trigger('fadeIn', [
  transition('void => *', useAnimation(fadeInAnimation, {params: {delay: '300ms'}}) )
]);

export const fadeOut = trigger('fadeOut', [
  transition('* => void', useAnimation(fadeOutAnimation, {params: {delay: '300ms'}}) )
]);



export const fadeInOut = trigger('fadeInOut', [
  transition('void => *', useAnimation(fadeInAnimation, {params: {delay: '300ms'}}) ),
  transition('* => void', useAnimation(fadeOutAnimation, {params: {delay: '300ms'}}) )
]);

