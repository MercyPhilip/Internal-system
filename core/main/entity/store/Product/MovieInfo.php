<?php
/**
 * Entity for MovieInfo
 *
 * @package    Core
 * @subpackage Entity
 * @author     philip<philip.f.xiao@gmail.com>
 */
class MovieInfo extends BaseEntityAbstract
{
    /**
     * The product
     *
     * @var Product
     */
    protected $product;
    /**
     * The alias of the movie
     *
     * @var string
     */
    private $alias;
    /**
     * The year of production of the movie
     *
     * @var string
     */
    private $yearOfProduction;
    /**
     * The release date of the movie
     *
     * @var UDate
     */
    private $releaseDate = '';
    /**
     * The director of the movie
     *
     * @var string
     */
    private $director;
    /**
     * The language of the movie
     *
     * @var string
     */
    private $language;
    /**
     * The trailer of the movie
     *
     * @var string
     */
    private $trailer;
    /**
     * The type of the movie
     *
     * @var string
     */
    private $productType;
    /**
     * The actor name of the movie
     *
     * @var string
     */
    private $actorName;
    /**
     * The audio format of the movie
     *
     * @var string
     */
    private $audioFormat;
    /**
     * The running time of the movie
     *
     * @var int
     */
    private $runningTime;
    /**
     * The aspect ratio of the movie
     *
     * @var string
     */
    private $aspectRatio;
    /**
     * The format name of the movie
     *
     * @var string
     */
    private $formatName;
    /**
     * The color format of the movie
     *
     * @var string
     */
    private $colorFormat;
    /**
     * The number of disc of the movie
     *
     * @var int
     */
    private $numberOfDisc;
    /**
     * The rating of the movie
     *
     * @var string
     */
    private $rating;
    /**
     * The contract region of the movie
     *
     * @var string
     */
    private $contractRegion;
    /**
     * Getter for product
     *
     * @return Product
     */
    public function getProduct()
    {
        $this->loadManyToOne('product');
        return $this->product;
    }
    /**
     * Setter for product
     *
     * @param Product $value The product
     *
     * @return ProductEta
     */
    public function setProduct(Product $value)
    {
        $this->product = $value;
        return $this;
    }
    /**
     * Getter for alias
     *
     * @return string
     */
    public function getAlias()
    {
        return $this->alias;
    }
    /**
     * Setter for alias
     *
     * @param string $value The alis
     *
     * @return MovieInfo
     */
    public function setAlias($value)
    {
        $this->alias = $value;
        return $this;
    }
    /**
     * Getter for year of production
     *
     * @return string
     */
    public function getYearOfProduction()
    {
        return $this->yearOfProduction;
    }
    /**
     * Setter for year of production
     *
     * @param string $value The year of production
     *
     * @return MovieInfo
     */
    public function setYearOfProduction($value)
    {
        $this->yearOfProduction = $value;
        return $this;
    }
    /**
     * Getter for ETA
     *
     * @return UDate
     */
    public function getEta()
    {
        return $this->eta;
    }
    /**
     * Setter for ETA
     *
     * @param string $value The purchaseOrder id
     *
     * @return ProductEta
     */
    public function setEta($value)
    {
        $this->eta = $value;
        return $this;
    }
    /**
     * Getter for received
     *
     * @return bool
     */
    public function getReceived()
    {
        return (trim($this->received) === '1');
    }
    /**
     * Setter for received
     *
     * @param unkown $value The received
     *
     * @return ProductEta
     */
    public function setReceived($value)
    {
        $this->received = $value;
        return $this;
    }
    /**
     * (non-PHPdoc)
     * @see BaseEntityAbstract::getJson()
     */
    public function getJson($extra = array(), $reset = false, $getItems = false)
    {
        $array = $extra;
        if(!$this->isJsonLoaded($reset))
        {
            $array['product'] = $this->getProduct() instanceof Product ? $this->getProduct()->getJson() : array();
            $array['po'] = $this->getPurchaseOrder() instanceof PurchaseOrder ? $this->getPurchaseOrder()->getJson() : array();
            $array['item'] = $this->getPurchaseOrderItem() instanceof PurchaseOrderItem ? $this->getPurchaseOrderItem()->getJson() : array();
        }
        return parent::getJson($array, $reset);
    }
    /**
     * (non-PHPdoc)
     * @see HydraEntity::__loadDaoMap()
     */
    public function __loadDaoMap()
    {
        DaoMap::begin($this, 'pro_eta');

        DaoMap::setManyToOne('purchaseOrder', 'PurchaseOrder', 'pro_eta_po');
        DaoMap::setManyToOne('purchaseOrderItem', 'PurchaseOrderItem', 'pro_eta_item');
        DaoMap::setManyToOne('product', 'Product', 'pro_eta_pro');
// 		DaoMap::setIntType('itemId');
        DaoMap::setDateType('eta');
        DaoMap::setBoolType('received');
        DaoMap::setManyToOne('store', 'Store', 'si');
        parent::__loadDaoMap();
// 		DaoMap::createIndex('itemId');
        DaoMap::createIndex('eta');
        DaoMap::createIndex('received');
        DaoMap::commit();
    }
    /**
     * creating a Product ETA
     *
     * @param PurchaseOrder $po
     * @param Product       $product
     * @param integer 		$itemId
     * @param DateFormat    $eta
     *
     * @return ProductEta
     */
    public static function create(PurchaseOrder $po, Product $product, PurchaseOrderItem $item, $eta)
    {
        $entity = new ProductEta();
        $entity->setPurchaseOrder($po)
            ->setPurchaseOrderItem($item)
            ->setProduct($product)
// 		->setItemId($itemId)
            ->setEta($eta)
            ->setStore(Core::getUser()->getStore())
            ->save();

        return $entity;
    }
}
