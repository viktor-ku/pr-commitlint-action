import path from 'path';
import fs from 'fs';
import yaml from 'yaml';

interface Props {
  tag: string;
  version: string;
}

interface Body {
  runs: { image: string }
}

export function preCommit(props: Props) {
  const actionYmlPath = path.resolve(process.env.GITHUB_WORKSPACE!, 'action.yml');

  const fileContent = fs.readFileSync(actionYmlPath, 'utf-8');
  const content = yaml.parse(fileContent) as Body;

  const { image: oldImage } = content.runs;
  const tag = oldImage.split(':').pop()!;
  const newImage = oldImage.replace(tag, props.tag);

  const newYmlContent = yaml.stringify({
    ...content,
    runs: {
      ...content.runs,
      image: newImage,
    },
  });

  fs.writeFileSync(actionYmlPath, newYmlContent);
}
