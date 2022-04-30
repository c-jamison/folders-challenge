const sortFn = (a, b) => {
  if (a.name.toLowerCase() < b.name.toLowerCase()) {
    return -1;
  } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
    return 1;
  }
  return 0;
};

const service = {
  folders: { name: "root", children: [] },
  reset: () => {
    service.folders.children = [];
  },
  buildPrintString: (node, acc, prefix = "") => {
    acc.push(`${prefix}${node.name}`);

    if (!node?.children?.length) {
      return;
    }

    node.children.map((n) => service.buildPrintString(n, acc, prefix + "  "));
  },
  print: (nodes) => {
    const folderPathList = [];
    nodes.map((n) => service.buildPrintString(n, folderPathList));
    return folderPathList;
  },

  addToFolder: (names, subFolder) => {
    if (!subFolder) {
      // TODO: Support creating deeply nested folders on one command?

      // do not add folder if parent path is incorrect
      return;
    }

    // copy to avoid updating input parameters
    const folderNames = [...names];
    if (folderNames.length === 1) {
      subFolder.children.push({ name: folderNames[0], children: [] });

      // TODO: would be more efficient to insert into sorted index instead of sorting after
      subFolder.children.sort(sortFn);
    }

    const name = names.shift();

    return service.addToFolder(
      names,
      subFolder.children.find((c) => c.name === name)
    );
  },

  create: (folderPath) => {
    const folderNames = folderPath.split("/");

    const existing = service.findNode(folderNames, service.folders);
    if (existing) {
      // Do nothing if folder already exists
      return;
    }

    return service.addToFolder(folderNames, service.folders);
  },

  findNode(names, subFolder) {
    const folderNames = [...names];

    const name = folderNames.shift();
    const child = subFolder.children.find((f) => f.name === name);

    if (!folderNames.length) {
      return child;
    }

    if (!child) {
      return null;
    }

    return service.findNode(folderNames, child);
  },

  removeFromFolder(names, subFolder) {
    if (!subFolder) {
      // TODO: if path doesn't exist throw error specific to folder name
      return;
    }
    const folderNames = [...names];

    const name = folderNames.shift();
    const subFolderChild = subFolder.children.find((c) => c.name === name);

    if (!folderNames.length && subFolderChild) {
      return (subFolder.children = subFolder.children.filter(
        (c) => c.name !== name
      ));
    }

    if (!subFolderChild) {
      throw new Error(`${name} does not exist`);
    }

    service.removeFromFolder(folderNames, subFolderChild);
  },

  delete(folderPath) {
    try {
      service.removeFromFolder(folderPath.split("/"), service.folders);
    } catch (e) {
      const errorMessage = `Cannot delete ${folderPath} - ${e.message}`;
      return errorMessage;
    }
  },
  move: (source, target) => {
    const sourcePath = source.split("/");
    const targetPath = target.split("/");

    const sourceFolder = service.findNode(sourcePath, service.folders);
    const targetFolder = service.findNode(targetPath, service.folders);

    if (!sourceFolder && !targetFolder) {
      // TODO: Should throw error?
      // Do nothing
      return;
    }

    service.delete(source);

    // No need to use service.create because already have target in variable for validation
    // This has benefit of moving all subchildren as well
    targetFolder.children.push(sourceFolder);

    // TODO: Refactor to insert into sort index
    targetFolder.children.sort(sortFn);
  },
};

module.exports = service;
