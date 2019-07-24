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
    db('projects')
    .then(projects => {
        res.status(200).json(projects)
    })
    .catch(err => {
        res.status(500).json(err)
    })
}); 

//check
router.post('/', async (req, res) => {
    try {
        const project = await db('projects').insert(req.body)
        res.status(201).json(project)
    } catch (error) {
        res.status(500).json({ error: 'There was an error posting that!' })
    }
});

//check
router.get('/:id', (req, res) => {
    const { id } = req.params;
        db('projects')
           .where({ id: id })
           .first()
           .then(projects => {
               db('actions')
                 .where({ project_id: id }).then(actions => {
                (projects.actions = actions);
                  return res.status(200).json(projects);
                });
           })
            .catch(err => {
                res.status(500).json({ Error: "There was an error getting that" })
            });
});

//
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db('projects').where({id: id}).del().then(response => {
        if (response === 0) {
            res.status(404).json({ERROR: "ID Not found"});
            console.log("FAIL, ID Not found");
            return;
        } else if (response === 1) {
            res.status(200).json({successfulDelete: `id: ${id}`});
            console.log("SUCCESS");
        };
    }).catch(err => {
        console.log(err);
        res.status(500).json({serverError: "FAIL"});
        res.end();
    });
});

//
router.put('/:id', (req, res) => {
    const {id} = req.params;
    const {name, description, completed} = req.body;
    if(!name && !description && !completed) {
        res.status(400).json({error: "bad request from user"});
        return;
    };
    db('projects').where({id: id}).update({name, description, completed}).then(response => {
        if (response === 0) {
            res.status(404).json({error: "ID not found"});
            return;
        } else if (response === 1) {
            res.status(200).json(["success"]);
        };
    }).catch(err => {
        res.status(500).json(err);
    });
});

module.exports = router; 