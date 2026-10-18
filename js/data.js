/* Demo data for Where Were We. Replace with real data from your backend. */
window.WWW_DATA = {
  firstYear: 2010,
  lastYear: 2026,
  cities: {
    Perth: [-31.95, 115.86], Sydney: [-33.87, 151.21], London: [51.51, -0.13], Barcelona: [41.39, 2.17],
    Cairns: [-16.92, 145.77], Melbourne: [-37.81, 144.96], Auckland: [-36.85, 174.76], Toronto: [43.65, -79.38],
    Berlin: [52.52, 13.40], Lisbon: [38.72, -9.14]
  },
  people: [
    { id: 'you', name: 'You', color: '#D62976', tint: '#FDE7F1', stays: [
      { from: 2010, to: 2012, city: 'Perth', note: 'Uni, first job' },
      { from: 2013, to: 2014, city: 'Sydney', note: 'The Surry Hills flat' },
      { from: 2015, to: 2016, city: 'London', note: 'Two winters, no regrets' },
      { from: 2017, to: 2018, city: 'Barcelona', note: 'Learnt to sail' },
      { from: 2019, to: 2023, city: 'Cairns', note: 'Reef years' },
      { from: 2024, to: 2026, city: 'Melbourne', note: 'Back in the city' } ] },
    { id: 'sam', name: 'Sam', color: '#4F5BD5', tint: '#E8EAFB', stays: [
      { from: 2010, to: 2011, city: 'Auckland', note: 'Gap year' },
      { from: 2012, to: 2014, city: 'Sydney', note: 'Newtown share house' },
      { from: 2015, to: 2016, city: 'Toronto', note: 'Cold, very cold' },
      { from: 2017, to: 2019, city: 'London', note: 'Grad school' },
      { from: 2020, to: 2024, city: 'Sydney', note: 'Home for good (ish)' },
      { from: 2025, to: 2026, city: 'Melbourne', note: 'New job' } ] },
    { id: 'jo', name: 'Jo', color: '#C2550F', tint: '#FFF1E5', stays: [
      { from: 2010, to: 2014, city: 'Melbourne', note: 'Grew up here' },
      { from: 2015, to: 2016, city: 'London', note: 'Bar work in Soho' },
      { from: 2017, to: 2018, city: 'Berlin', note: 'The studio' },
      { from: 2019, to: 2021, city: 'Lisbon', note: 'Remote everything' },
      { from: 2022, to: 2026, city: 'Melbourne', note: 'Came home' } ] }
  ]
};
