const { CREATE, DELETE, LIST, MOVE } = require("./constant/command.const");
const CommandParser = require("./service/command-parser.service");
const FolderService = require("./service/folder.service");

const sampleData = require("./misc/sampleData");

const service = {
  run() {
    try {
      sampleData.forEach((input) => {
        console.log(input);
        service.process(CommandParser.parse(input));
      });
    } catch (e) {
      console.log("Error processing input", e);
    }
  },
  process(input) {
    switch (input.command) {
      case CREATE:
        return FolderService.create(...input.params);
      case LIST:
        // TODO: Refactor to only pass in root level folders instead of children
        const printList = FolderService.print(FolderService.folders.children);
        printList.forEach((p) => console.log(p));
        return;
      case MOVE:
        return FolderService.move(...input.params);
      case DELETE:
        const message = FolderService.delete(...input.params);
        if (message) console.log(message);
    }
  },
};

service.run();
