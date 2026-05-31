import type { ImageSourcePropType } from 'react-native';

// React Native requires static literal paths in require(), so bundled images
// must be registered explicitly. Each lesson card references a key here.
// Real artwork (AI-generated or curated) drops into assets/images/<level>/ and
// gets wired up below — no schema or data changes needed.
const registry: Record<string, ImageSourcePropType> = {
  'a1/boy': require('../../assets/images/a1/boy.png'),
  'a1/girl': require('../../assets/images/a1/girl.png'),
  'a1/dog': require('../../assets/images/a1/dog.png'),
  'a1/dog-run': require('../../assets/images/a1/dog-run.png'),
  'a1/boy-eat': require('../../assets/images/a1/boy-eat.png'),
  'a1/girl-happy': require('../../assets/images/a1/girl-happy.png'),
  'a1/dog-run-fast': require('../../assets/images/a1/dog-run-fast.png'),
  'a1/boy-sad': require('../../assets/images/a1/boy-sad.png'),
  'a1/dog-angry': require('../../assets/images/a1/dog-angry.png'),
  'a1/girl-sad': require('../../assets/images/a1/girl-sad.png'),
  'a1/cat':        require('../../assets/images/a1/cat.jpg'),
  'a1/cat-sleep':  require('../../assets/images/a1/cat-sleep.jpg'),
  'a1/dog-big':    require('../../assets/images/a1/dog-big.jpg'),
  'a1/cat-small':  require('../../assets/images/a1/cat-small.jpg'),
  'a1/dog-jump':   require('../../assets/images/a1/dog-jump.jpg'),
  'a1/boy-drink':  require('../../assets/images/a1/boy-drink.jpg'),
  'a1/girl-play':  require('../../assets/images/a1/girl-play.jpg'),
  'a1/dog-walk':   require('../../assets/images/a1/dog-walk.jpg'),
  'a1/bird':       require('../../assets/images/a1/bird.jpg'),
  'a1/fish':       require('../../assets/images/a1/fish.jpg'),
};

/** Resolve a bundled image key, or undefined for an unknown/remote key. */
export function getImage(key: string | null): ImageSourcePropType | undefined {
  if (!key) return undefined;
  return registry[key];
}

export default registry;
