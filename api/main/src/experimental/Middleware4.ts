function p1(): Promise<boolean> {
  return new Promise(resolve => resolve(true));
}

p1().then();
