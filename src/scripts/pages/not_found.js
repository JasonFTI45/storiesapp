
export default class NotFoundView {
  async render() {
    return `
      <section class="not-found">
        <h2>404 - Page Not Found</h2>
        <p class="homeInfo">The page you are looking for does not exist.</p>
      </section>
    `;
  }

  async afterRender() {
    console.log("Page Not Found");
    }
}
