const FolderService = require("./folder.service");

describe("Folder Service", () => {
  beforeEach(() => {
    FolderService.reset();
  });
  test("should build list of strings to for single top level folder", () => {
    const input = [
      {
        name: "fruit",
        children: [],
      },
    ];

    const results = ["fruit"];

    expect(FolderService.print(input)).toEqual(results);
  });

  test("should build list of strings to for multiple top level folders", () => {
    const input = [
      {
        name: "fruits",
        children: [],
      },
      {
        name: "vegetables",
        children: [],
      },
    ];

    const results = ["fruits", "vegetables"];

    expect(FolderService.print(input)).toEqual(results);
  });

  test("should build list of strings for nested folders", () => {
    const input = [
      {
        name: "fruit",
        children: [
          {
            name: "apple",
            children: [
              {
                name: "fuji",
                children: [],
              },
            ],
          },
          {
            name: "orange",
            children: [],
          },
        ],
      },
    ];

    const results = ["fruit", "  apple", "    fuji", "  orange"];

    expect(FolderService.print(input)).toEqual(results);
  });

  test("should create new folder based on path", () => {
    const input = "fruit";

    FolderService.create(input);

    const folders = FolderService.folders;
    const results = {
      name: "root",
      children: [
        {
          name: "fruit",
          children: [],
        },
      ],
    };
    expect(folders).toEqual(results);
  });

  test("should return error message if deleted folder doesn't exist", () => {
    const input = "fruit";

    const result = FolderService.delete(input);

    expect(result).toEqual(`Cannot delete fruit - fruit does not exist`);
  });

  test.only("should delete child folder", () => {
    FolderService.create("foods");
    FolderService.create("foods/fruits");
    FolderService.create("foods/fruits/apple");

    FolderService.delete("foods/fruits/apple");

    const folders = FolderService.folders;
    const results = {
      name: "root",
      children: [
        {
          name: "foods",
          children: [{ name: "fruits", children: [] }],
        },
      ],
    };
    expect(folders).toEqual(results);
  });

  test("should create new sub folders", () => {
    const inputList = [
      "fruit",
      "fruit/apples",
      "vegetables",
      "fruit/apples/fuji",
      "vegetables/broccoli",
    ];
    inputList.forEach((i) => FolderService.create(i));

    const folders = FolderService.folders;
    const results = {
      name: "root",
      children: [
        {
          name: "fruit",
          children: [
            {
              name: "apples",
              children: [
                {
                  name: "fuji",
                  children: [],
                },
              ],
            },
          ],
        },
        {
          name: "vegetables",
          children: [
            {
              name: "broccoli",
              children: [],
            },
          ],
        },
      ],
    };

    expect(folders).toEqual(results);
  });

  test("should find and return child folder", () => {
    const folders = {
      name: "root",
      children: [
        {
          name: "fruit",
          children: [{ name: "apples", children: [] }],
        },
      ],
    };

    const result = {
      name: "apples",
      children: [],
    };

    expect(FolderService.findNode(["fruit", "apples"], folders)).toEqual(
      result
    );
  });

  test("should sort child folders on create", () => {
    FolderService.create("fruit");
    FolderService.create("fruit/orange");
    FolderService.create("fruit/apple");

    const folders = FolderService.folders;

    expect(folders.children[0].children[0].name).toEqual("apple");
  });

  test("should move folder to new parent", () => {
    FolderService.create("fruit");
    FolderService.create("fruit/apples");
    FolderService.create("food");

    FolderService.move("fruit/apples", "food");
    const folders = FolderService.folders;
    const results = {
      name: "root",
      children: [
        {
          name: "food",
          children: [
            {
              name: "apples",
              children: [],
            },
          ],
        },
        {
          name: "fruit",
          children: [],
        },
      ],
    };

    expect(folders).toEqual(results);
  });
});
