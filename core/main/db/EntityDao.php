<?php
/**
 * Entity Dao - The more generic dao for entities
 *
 * @package    Core
 * @subpackage Dao
 * @author     lhe<helin16@gmail.com>
 */
class EntityDao
{
    /**
     * The DaoQuery being queried by the Dao
     *
     * @var DaoQuery
     */
    private $_query;
    /**
     * Temporary copy of the original DaoQuery
     *
     * @var DaoQuery
     */
    private $_tmpQuery;
    /**
     * Last id inserted into this table
     *
     * @var int
     */
    private $_lastId = -1;
    /**
     * Number of rows that were changed by the last query
     *
     * @var int
     */
    private $_affectedRows = -1;
    /**
     * The pagination stats
     *
     * @var array
     */
    private $_pageStats = array('totalPages' => null, 'totalRows' => null, 'pageNumber' => null, 'pageSize' => DaoQuery::DEFAUTL_PAGE_SIZE);
    /**
     * The registery of the entity daos
     *
     * @var array
     */
    private static $_entityDaos = array();
    /**
     * @param string $namespace
     */
    public function __construct($entityClassName)
    {
        $this->_tmpQuery = new DaoQuery($entityClassName);
        $this->resetQuery();
    }
    /**
     * Singleton Design of the entity Dao
     *
     * @param string $entityName The name of the entity
     *
     * @return EntityDao
     */
    public static function getInstance($entityName)
    {
        if(!array_key_exists($entityName, self::$_entityDaos))
        self::$_entityDaos[$entityName] = new EntityDao($entityName);
        return self::$_entityDaos[$entityName];
    }
    /**
     * set a new query to the dao
     * 
     * @param DaoQuery $query The new query
     * 
     * @return EntityDao
     */
    public function setQuery(DaoQuery $query)
    {
        $this->_query = $query;
        return $this;
    }
    /**
     * Return the internal DaoQuery instance
     *
     * @return DaoQuery
     */
    public function getQuery()
    {
        return $this->_query;
    }
    /**
     * Save an entity
     *
     * @param BaseEntityAbstract $entity The entity that we are tyring to save
     *
     * @return GenericDAO
     */
    public function save(BaseEntityAbstract $entity)
    {
        if (is_array($messages = $entity->validateAll()) && count($messages) > 0)
        throw new EntityValidationException($messages);
        $newEntity = (trim($entity->getId()) === '');
        $entity = Dao::save($entity);
        if ($newEntity === true)
        {
            $this->_lastId = $entity->getId();
            $this->_affectedRows = 1;
        }
        else
        {
            $this->_affectedRows = 1;
            $this->_lastId = -1;
        }
        $this->resetQuery();
        return $entity;
    }
    /**
     * Get a single instance of an entity by its database record id
     *
     * @param int $id The id of the entity
     *
     * @return BaseEntityAbstract
     */
    public function findById($id)
    {
        $results = Dao::findById($this->_query, $id);
        $this->resetQuery();
        return $results;
    }
    /**
     * Get a set of results that match a particular where clause
     *
     * @param string $criteria      The search criteria string
     * @param array  $params        The parameters of the query to replace '?'(without the quotes)
     * @param array  $orderByParams The order clause Array[Entity.Field] = 'direction'
     *
     * @return array
     */
    public function findByCriteria($criteria, array $params = array(), $pageNumber = null, $pageSize = DaoQuery::DEFAUTL_PAGE_SIZE, array $orderByParams = array())
    {
        $results = Dao::findByCriteria($this->_query, $criteria, $params, $pageNumber, $pageSize, $orderByParams);
        $this->_pageStats = Dao::getPageStats();
        $this->resetQuery();
        return $results;
    }
    /**
     * returning the pagination stats
     *
     * @return array
     */
    public function getPageStats()
    {
        return $this->_pageStats;
    }
    /**
     * Deleting an entity from database
     *
     * @param BaseEntityAbstract $entity The entity that we are trying to delete
     *
     * @return int The number rows affected
     */
    public function delete(BaseEntityAbstract $entity)
    {
        return $this->deleteByCriteria('`id` = ? ', array($entity->getId()));
    }
    /**
     * Deactivate an entity instance
     *
     * @param BaseEntityAbstract $entity The entity that we are trying to deactiate
     *
     * @return int The number rows affected
     */
    public function deactivate(BaseEntityAbstract $entity)
    {
        $entity->setActive(false);
        $entity = Dao::save($entity);
        $this->_affectedRows = 1;
        $this->_lastId = -1;
        $this->resetQuery();
        return $this->_affectedRows;
    }
    /**
     * Activate an entity instance
     *
     * @param BaseEntityAbstract $entity The entity that we are trying to activate
     *
     * @return int The number rows affected
     */
    public function activate(BaseEntityAbstract $entity)
    {
        $entity->setActive(true);
        $entity = Dao::save($entity);
        $this->_affectedRows = 1;
        $this->_lastId = -1;
        $this->resetQuery();
        return $this->_affectedRows;
    }
    /**
     * Get a paged list of entities of a particular type
     *
     * @param int   $pageNumber The page number for pagination
     * @param int   $pageSize   The page size for pagination
     * @param array $orderBy    The order by clause
     *
     * @return array An array of BaseEntityAbstract
     */
    public function findAll($pageNumber = null, $pageSize = DaoQuery::DEFAUTL_PAGE_SIZE, $orderBy = array())
    {
        $results = Dao::findAll($this->_query, $pageNumber, $pageSize, $orderBy);
        $this->_pageStats = Dao::getPageStats();
        $this->resetQuery();
        return $results;
    }
    /**
     * Last id inserted into this table
     *
     * @return int
     */
    public function getLastId()
    {
        return $this->_lastId;
    }
    /**
     * Number of rows that were changed by the last query
     *
     * @return int
     */
    public function getAffectedRows()
    {
        return $this->_affectedRows;
    }
    /**
     * Reset the internal DaoQuery back to its original state
     *
     * @return GenericDAO
     */
    protected function resetQuery()
    {
        $this->_query = clone $this->_tmpQuery;
        return $this;
    }
    /**
     * Updating a table for the search criteria
     *
     * @param string $setClause The set clause
     * @param string $criteria  The where clause
     * @param array  $params    The parameters
     *
     * @return int
     */
    public function updateByCriteria($setClause, $criteria, $params = array())
    {
        return Dao::updateByCriteria($this->_query, $setClause, $criteria, $params);
    }
    /**
     * Getting the total count for the search criteria
     *
     * @param string   $criteria The where clause
     * @param array    $params   The parameters
     *
     * @return int
     */
    public function countByCriteria($criteria, $params = array())
    {
        return Dao::countByCriteria($this->_query, $criteria, $params);
    }
    /**
     * delete a table for the search criteria
     *
     * @param string   $criteria The where clause
     * @param array    $params   The parameters
     *
     * @return int
     */
    public function deleteByCriteria($criteria, $params = array())
    {
        return Dao::deleteByCriteria($this->_query, $criteria, $params);
    }
    /**
     * replace into
     * 
     * @param string $table   The table name
     * @param array  $columns The name of the columns
     * @param array  $values  The values that will match agains the column names
     * @param array  $params  The params
     * 
     * @return PDOStatement
     */
    public function replaceInto($table, $columns, $values, $params = array())
    {
        return Dao::replaceInto($table, $columns, $values, $params);
    }
    /**
     * Add a join table record for many to many relationship
     *
     * @param BaseEntityAbstract $leftEntity  The left entity
     * @param BaseEntityAbstract $rightEntity The right entity
     *
     * @return int
     */
    public function saveManyToManyJoin(BaseEntityAbstract $leftEntity, BaseEntityAbstract $rightEntity)
    {
        Dao::saveManyToManyJoin(new DaoQuery(get_class($leftEntity)), get_class($rightEntity), $leftEntity->getId(), $rightEntity->getId());
        return 1;
    }
    /**
     * Remove a join table record for many to many relationship
     *
     * @param BaseEntityAbstract $leftEntity  The left entity
     * @param BaseEntityAbstract $rightEntity The right entity
     *
     * @return int
     */
    public function deleteManyToManyJoin(BaseEntityAbstract $leftEntity, BaseEntityAbstract $rightEntity)
    {
        Dao::deleteManyToManyJoin(new DaoQuery(get_class($leftEntity)), get_class($rightEntity), $leftEntity->getId(), $rightEntity->getId());
        return 1;
    }
}
?>
