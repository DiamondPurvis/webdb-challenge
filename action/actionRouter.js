const knex = require('knex');
const router = require('express').Router();








const knexConfig = {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: './data/lambda.sqlite3'
    }
}

const db = knex(knexConfig);

//check
// router.get('/', (req, res) => {
//     res.send('Hello World!')
// });


//check
router.get('/', (req, res) => {
    db('actions')
    .then(actions => {
        res.status(200).json(actions)
    })
    .catch(err => {
        res.status(500).json(err)
    })
});

//check
router.post('/', async (req, res) => {
    try {
        const action = await db('actions').insert(req.body)
        res.status(201).json(action)
    } catch (error) {
        res.status(500).json({ error: 'There was an error posting that!' })
    }
});

//
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db('actions').where({id: id}).del().then(response => {
        //console.log(response);
        if (response === 0) {
            res.status(404).json({ERROR: 'ID Not found'});
            console.log('FAIL, ID Not found');
            return;
        } else if (response === 1) {
            res.status(200).json({successfulDelete: `id: ${id}`});
            console.log('SUCCESS');
        };
    }).catch(err => {
        console.log(err);
        res.status(500).json({serverError: 'FAIL'});
        res.end();
    });
});

//
router.put('/:id', (req, res) => {
    const {id} = req.params;
    const {project_id, description, notes, completed} = req.body;
    if(!project_id && !description && !notes && !completed) {
        res.status(400).json({error: 'bad request from user'});
        return;
    }
    db('actions').where({id: id}).update({project_id, description, notes, completed}).then(response => {
        if (response === 0) {
            res.status(404).json({error: 'ID not found'});
            return;
        } else if (response === 1) {
            res.status(200).json(['success']);
        };
    }).catch(err => {
        res.status(500).json(err);
    });
});

module.exports = router; 