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
  'a1/boy-girl-happy': require('../../assets/images/a1/boy-girl-happy.png'),
};

/** Resolve a bundled image key, or undefined for an unknown/remote key. */
export function getImage(key: string | null): ImageSourcePropType | undefined {
  if (!key) return undefined;
  return registry[key];
}

export default registry;
