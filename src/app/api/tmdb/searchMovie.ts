export const searchMovie = async (query: string) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + process.env.NEXT_PUBLIC_BEARER_HEADER,
    },
  };

  fetch(
    `https://api.themoviedb.org/3/search/movie?query=${query}&language=en-US&page=1`,
    options,
  )
    .then((res) => res.json())
    .then((res) => console.log(res))
    .catch((err) => console.error(err));
};
