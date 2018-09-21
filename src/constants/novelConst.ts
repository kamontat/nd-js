import axios from "axios";

/**
 * This can use alter link 'https://writer.dek-d.com/Writer/story/view.php?id='
 */
export const NOVEL_LINK = "https://my.dek-d.com/dek-d/writer/view.php";

axios.defaults.baseURL = NOVEL_LINK;
