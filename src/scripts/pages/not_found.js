
export default class NotFoundView {
  async render() {
    return `
      <section class="container">
        <h1>Not Found </h1>
        <p class="homeInfo">Page Not Found</p>
      </section>  
    `;
  }

  async afterRender() {
    console.log("Page Not Found");
    }
}
