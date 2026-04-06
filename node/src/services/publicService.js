const {
  getPublicSiteSettings,
  getHomeContent,
  getBrandStory,
  getBlogPage,
  getSeoSettings,
  getSubscribePopup
} = require("./settingsService");
const {
  getCategories,
  getVideoCategories,
  getBlogCategories,
  getProducts,
  getVideos,
  getBlogs
} = require("./catalogService");

async function getPublicBootstrap() {
  const [
    siteSettings,
    homeContent,
    subscribePopup,
    brandStory,
    blogPage,
    seo,
    categories,
    videoCategories,
    blogCategories,
    products,
    videos,
    blogs
  ] =
    await Promise.all([
      getPublicSiteSettings(),
      getHomeContent(),
      getSubscribePopup(),
      getBrandStory(),
      getBlogPage(),
      getSeoSettings(),
      getCategories(false),
      getVideoCategories(false),
      getBlogCategories(false),
      getProducts({ status: "published" }),
      getVideos({ status: "published" }),
      getBlogs({ status: "published" })
    ]);

  return {
    siteSettings,
    homeContent,
    subscribePopup,
    brandStory,
    blogPage,
    seo,
    categories,
    videoCategories,
    blogCategories,
    products,
    videos,
    blogs
  };
}

module.exports = {
  getPublicBootstrap
};
