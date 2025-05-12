import { idbGetAllStories, idbDeleteStory } from '../../utils/idb';

export default class SavedPage {
  async render() {
    return `
      <section class="container">
        <h1>Saved Stories</h1>
        <div id="saved-stories-list"></div>
      </section>
    `;
  }

  async afterRender() {
    const container = document.getElementById('saved-stories-list');
    container.innerHTML = '';
    const stories = await idbGetAllStories();

    if (!stories.length) {
      container.innerHTML = '<p>No saved stories found.</p>';
      return;
    }

    stories.forEach((story) => {
      const storyElement = document.createElement('div');
      storyElement.classList.add('story-item');
      storyElement.innerHTML = `
        <img src="${story.photoUrl}" alt="${story.name}" class="story-image" />
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <p>Latitude: ${story.lat ?? '-'}, Longitude: ${story.lon ?? '-'}</p>
        <button class="delete-button" data-id="${story.id}">Delete</button>
      `;
      container.appendChild(storyElement);

    });
    this.addDeleteButtonListener();
  }
  addDeleteButtonListener() {
    const container = document.getElementById('saved-stories-list');
    container.addEventListener('click', async (event) => {
      if (event.target.classList.contains('delete-button')) {
        const id = event.target.dataset.id;
        await idbDeleteStory(id);
        alert('Story Deleted!');
        await this.afterRender(); 
      }
    });
  }
}


