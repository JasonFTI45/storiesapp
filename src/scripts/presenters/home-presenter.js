import StoryModel from "../data/story-model.js";
import HomeView from "../pages/home/home-view.js";
import { idbSaveStory } from "../utils/idb.js";

export default class HomePresenter {
  constructor() {
    this.model = new StoryModel();
    this.view = new HomeView();
  }

  async init() {
    this.view.bindAddStory(this.handleAddStory.bind(this));

    try {
      if (localStorage.getItem("token")) {
        const stories = await this.model.fetchStories();
        const container = this.view.getStoriesContainer();
        this.view.renderStories(stories, container);
        this.attachSaveButtonListeners(stories);
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
      const container = this.view.getStoriesContainer();
      container.innerHTML =
        "<p>Failed to load stories. Please try again later.</p>";
    }
  }

  async handleAddStory(storyData) {
    const token = localStorage.getItem("token");
    try {
      if (!token) {
        console.log("hallo");
        await this.model.addGuestStory(storyData);
      } else {
        await this.model.addUserStory(storyData);
      }

      alert("Story added successfully!");

      const storyForm = document.getElementById("storyForm");
      if (storyForm) {
        storyForm.reset();
        toggleStoryForm();
      }

      if (token) {
        const updatedStories = await this.model.fetchStories();
        this.view.renderStories(
          updatedStories,
          this.view.getStoriesContainer()
        );
      }
    } catch (error) {
      console.error("Error adding story:", error);
      const container = document.getElementById("stories-list");
      container.innerHTML = `<p class="error-message">Failed to add story: ${error.message}</p>`;
    }
  }

  attachSaveButtonListeners(stories) {
    const saveButtons = document.querySelectorAll('.save-button');
    if (saveButtons.length === 0) {
      console.warn('No save buttons found in the DOM.');
      return;
    }

    saveButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        const story = stories[index];
        idbSaveStory(story);
        alert('Story saved!');
      });
    });
  }
}
