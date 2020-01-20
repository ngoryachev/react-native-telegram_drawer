Project Brief

- React-Native init
- Typescript
- To build `yarn && yarn start`
- Drawer implemented from scratch
- Project is Trade off between "not enough time" and "beautiful ui"

Known issues
    
- You can infinitely scroll drawer to top although there maybe no more images (interpolation clamp problem)
- Selection of images preserves between drawer open/close
- `Animated.timing` used everywhere because of my own "timing" constraints, `easing` would be better ;)
- Send button visible even if there is nothing to send
- Open gallery not handles Camera Roll error use case  
- Send button lacks of selected images count badge
- It would be better to animate image selection instead of just changing size
- Selection sometimes steals drawer gestures
- Example not using photo pagination but should 
- Items must be a multiple of three or got ui bug
- ?
