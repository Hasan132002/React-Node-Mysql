import fs from 'fs';
import path from 'path';

const filePath = path.resolve('data', 'db.json');

export const readData = () => {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

export const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};
