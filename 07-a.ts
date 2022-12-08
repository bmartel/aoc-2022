// deno run --allow-read 07-a.ts

const data = (await Deno.readTextFile("07.txt")).split("\n");

// class File {
//   depth = 0;
//   isDirectory: boolean;
//   name: string;
//   children: File[];
//   size: number;
//   constructor(
//     name: string,
//     depth: number,
//     isDirectory: boolean = false,
//     size: number = 0,
//   ) {
//     this.name = name;
//     this.size = size;
//     this.depth = depth;
//     this.children = [];
//     this.isDirectory = isDirectory;
//   }

//   addChild(child: File) {
//     this.children.push(child);
//   }

//   findIndex(depth: number): File | undefined {
//     if (this.depth === depth) {
//       return this;
//     }
//     let i = this.children.length;
//     while (i--) {
//       const child = this.children[i];
//       const found = child.findIndex(depth);
//       if (found) {
//         return found;
//       }
//     }
//     return undefined;
//   }

//   find(name: string): File | undefined {
//     if (this.name === name) {
//       return this;
//     }
//     for (const child of this.children) {
//       const found = child.find(name);
//       if (found) {
//         return found;
//       }
//     }
//     return undefined;
//   }

//   indent(): string {
//     return " ".repeat(this.depth * 2);
//   }

//   toString(): string {
//     const children = this.children.map((child) => child.toString());

//     return `${this.indent()}${
//       this.isDirectory ? "[] " : " - "
//     }${this.name} (${this.walk()})
//     ${children.join(" ")}
//     `;
//   }

//   walk(): number {
//     return this.size +
//       this.children.reduce((acc, child) => acc + child.walk(), 0);
//   }

//   isDirectoryAtMost(size: number): boolean {
//     if (this.isDirectory) {
//       const _size = this.walk();
//       return _size <= size;
//     }
//     return false;
//   }

//   findChildDirectoriesAtMost(size: number): File[] {
//     const result: File[] = [];
//     if (this.depth > 0 && this.isDirectoryAtMost(size)) {
//       result.push(this);
//       return result;
//     }
//     for (const child of this.children) {
//       result.push(...child.findChildDirectoriesAtMost(size));
//     }
//     return result;
//   }
// }

// const stack: File[] = [];

// function parseLine(
//   line: string,
//   depth = 0,
// ): [File | undefined, string] {
//   let file: File | undefined;
//   const [a, b, c] = line.split(" ");

//   switch (a) {
//     case "$":
//       switch (b) {
//         case "cd":
//           switch (c) {
//             case "/":
//               file = new File("/", 0, true);
//               break;
//             default:
//               return [undefined, c.trim()];
//           }
//           break;
//         case "ls":
//         default:
//           break;
//       }
//       break;
//     case "dir":
//       file = new File(b, depth, true);
//       break;
//     default:
//       file = new File(b, depth, false, Number(a || 0));
//       break;
//   }

//   return [file, ""];
// }

// let i = 0;
// const result = parseLine(data[i]);
// const root = result[0]!;
// let currentDir: File | undefined = root;
// stack.push(root);
// let depth = stack.length;

// for (const line of data) {
//   // already parsed the first line, don't parse an empty either
//   if (i === 0 || line.trim() === "") {
//     i++;
//     continue;
//   }

//   const [file, cd] = parseLine(line, depth);

//   if (cd === "..") {
//     if (stack.length > 1) {
//       stack.pop();
//       depth = stack.length;
//       currentDir = stack[depth - 1];
//     }
//   } else if (cd !== "") {
//     const found = currentDir?.find(cd) as any;

//     if (found && found.isDirectory) {
//       console.log(
//         depth,
//         stack.map((s) => s.name).join("/").replace("//", "/"),
//         "operation: ",
//         `cd ${cd}`,
//       );
//       stack.push(found);
//       depth = stack.length;
//       currentDir = found;
//     }
//   }

//   if (currentDir && file) {
//     currentDir.addChild(file);

//     console.log(
//       depth,
//       stack.map((s) => s.name).join("/").replace("//", "/"),
//       "registering: ",
//       file.isDirectory ? "dir" : "file",
//       file.name,
//     );
//   }
// }

// console.log(
//   root.findChildDirectoriesAtMost(100000).map((f) => f.name + `(${f.walk()})`),
// );

// used the following to solve the problem, but interested to understand what was not working with the above ??!!
type Path = string;
type Creator<V> = () => V;

export const sum = (a: number[]) => a.reduce((sum, n) => sum + n, 0);
export const sort = (values: number[]) => values.sort((a, b) => a - b);
export const getOrCreate = <K, V>(
  map: Map<K, V>,
  key: K,
  creator: Creator<V>,
): V => {
  if (!map.has(key)) {
    map.set(key, creator());
  }

  return map.get(key)!;
};

abstract class FileSystemNode {
  constructor(
    public name: string,
    public path: Path,
    public parent: DirectoryNode | undefined = undefined,
    public children: FileSystemNode[] = [],
  ) {}

  addChild(node: FileSystemNode) {
    this.children.push(node);
  }
}

class FileNode extends FileSystemNode {
  constructor(
    public size: number,
    name: string,
    path: Path,
    parent: DirectoryNode,
  ) {
    super(name, path, parent);
  }
}

class DirectoryNode extends FileSystemNode {}

class FileSystem {
  currentDirectory: FileSystemNode;
  nodeMap: Map<Path, FileSystemNode>;

  constructor() {
    this.currentDirectory = new DirectoryNode("/", "/");
    this.nodeMap = new Map<string, FileSystemNode>();
    this.nodeMap.set("/", this.currentDirectory);
  }

  changeDirectory(name: string) {
    this.currentDirectory = name === ".." && !!this.currentDirectory.parent
      ? this.currentDirectory.parent
      : this.getDirectoryNode(name);
  }

  registerDirectory(name: string) {
    this.currentDirectory.addChild(this.getDirectoryNode(name));
  }

  registerFile(name: string, size: number) {
    this.currentDirectory.addChild(this.getFileNode(name, size));
  }

  getRootNode(): DirectoryNode {
    return this.nodeMap.get("/")!;
  }

  private getFileNode = (name: string, size: number) =>
    this.getNode(
      this.getPath(name),
      () => new FileNode(size, name, this.getPath(name), this.currentDirectory),
    );

  private getDirectoryNode = (name: string) =>
    this.getNode(
      this.getPath(name),
      () => new DirectoryNode(name, this.getPath(name), this.currentDirectory),
    );

  private getNode = (path: string, creator: () => FileSystemNode) =>
    getOrCreate(this.nodeMap, path, creator);

  private getPath = (name: string) => `${this.currentDirectory.path}${name}/`;
}

const buildFileSystem = (logs: string[]): FileSystem => {
  const fileSystem = new FileSystem();

  for (const parts of logs.map((l) => l.split(" "))) {
    if (parts[0] === "$" && parts[1] === "ls") continue;

    switch (parts[0]) {
      case "$":
        fileSystem.changeDirectory(parts[2]);
        break;
      case "dir":
        fileSystem.registerDirectory(parts[1]);
        break;
      default:
        fileSystem.registerFile(parts[1], Number(parts[0]));
    }
  }

  return fileSystem;
};

const getDirectorySizes = (
  node: FileSystemNode,
  sizesHolder: number[],
): number => {
  if (node instanceof FileNode) {
    return node.size;
  }

  const size = node.children.reduce(
    (sum, child) => sum + getDirectorySizes(child, sizesHolder),
    0,
  );

  sizesHolder.push(size);

  return size;
};

const totalDiskSpace = 70_000_000;
const spaceNeededForUpdate = 30_000_000;

function run() {
  const logs = data.slice(1);
  const fileSystem = buildFileSystem(logs);
  const sizes: number[] = [];
  const rootSize = getDirectorySizes(fileSystem.getRootNode(), sizes);
  const freeSpace = totalDiskSpace - rootSize;
  const remainingSpaceNeeded = spaceNeededForUpdate - freeSpace;
  const smallDirectorySums = sum(sizes.filter((s) => s <= 100000));
  const sizeOfDirectoryToDelete = sort(sizes).find((s) =>
    s >= remainingSpaceNeeded
  );

  console.log("Part 1", smallDirectorySums);
  console.log("Part 2", sizeOfDirectoryToDelete);
}

run();
