/**
 * @internal
 * @module nd.novel.constant
 */

/**
 * This can use alter link 'https://writer.dek-d.com/Writer/story/view.php?id='
 */
export const DEFAULT_NOVEL_LINK = "https://my.dek-d.com/dek-d/writer/view.php";
export const DEFAULT_CHAPTER_FILE_TEMPLATE = "chapter%s.html";

export const DEFAULT_NOVEL_FOLDER_NAME = (name: string) => {
  return `${name}`;
};

export const DEFAULT_RESOURCE_NAME = ".nd.resource.json";

export const DEFAULT_MAXIMUM_HISTORY = 300;
