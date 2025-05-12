import { getStories, addStory, addGuestStory } from "./api.js";

export default class StoryModel {
  async fetchStories() {
    return await getStories();
  }

  async addUserStory(storyData) {
    return await addStory(storyData);
  }

  async addGuestStory(storyData) {
    return await addGuestStory(storyData);
  }
}
