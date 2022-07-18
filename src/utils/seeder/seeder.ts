import cron from 'node-cron';

const seeder = cron.schedule('*/2 * * * *', () => {
    console.log('running a task every two minutes', new Date());
},
    { scheduled: false });
export default seeder