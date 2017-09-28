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
     * The subtitle of the movie
     *
     * @var string
     */
    private $subtitle;
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
     * @var number
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
     * @var number
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
     * Getter for release date
     *
     * @return UDate
     */
    public function getReleaseDate()
    {
        return $this->releaseDate;
    }
    /**
     * Setter for release date
     *
     * @param string $value The release date
     *
     * @return MovieInfo
     */
    public function setReleaseDate($value)
    {
        $this->releaseDate = $value;
        return $this;
    }
    /**
     * Getter for director
     *
     * @return string
     */
    public function getDirector()
    {
        return $this->director;
    }
    /**
     * Setter for director
     *
     * @param string $value The director
     *
     * @return MovieInfo
     */
    public function setDirector($value)
    {
        $this->director = $value;
        return $this;
    }
    /**
     * Getter for language
     *
     * @return string
     */
    public function getLanguage()
    {
        return $this->language;
    }
    /**
     * Setter for language
     *
     * @param string $value The language
     *
     * @return MovieInfo
     */
    public function setLanguage($value)
    {
        $this->language = $value;
        return $this;
    }
    /**
     * Getter for subtitle
     *
     * @return string
     */
    public function getSubtitle()
    {
        return $this->subtitle;
    }
    /**
     * Setter for subtitle
     *
     * @param string $value The subtitle
     *
     * @return MovieInfo
     */
    public function setSubtitle($value)
    {
        $this->subtitle = $value;
        return $this;
    }
    /**
     * Getter for trailer
     *
     * @return string
     */
    public function getTrailer()
    {
        return $this->trailer;
    }
    /**
     * Setter for trailer
     *
     * @param string $value The trailer
     *
     * @return MovieInfo
     */
    public function setTrailer($value)
    {
        $this->trailer = $value;
        return $this;
    }
    /**
     * Getter for product type
     *
     * @return string
     */
    public function getProductType()
    {
        return $this->productType;
    }
    /**
     * Setter for product type
     *
     * @param string $value The product type
     *
     * @return MovieInfo
     */
    public function setProductType($value)
    {
        $this->productType = $value;
        return $this;
    }
    /**
     * Getter for actor name
     *
     * @return string
     */
    public function getActorName()
    {
        return $this->actorName;
    }
    /**
     * Setter for actor name
     *
     * @param string $value The actor name
     *
     * @return MovieInfo
     */
    public function setActorName($value)
    {
        $this->actorName = $value;
        return $this;
    }
    /**
     * Getter for audio format
     *
     * @return string
     */
    public function getAudioFormat()
    {
        return $this->audioFormat;
    }
    /**
     * Setter for audio format
     *
     * @param string $value The audio format
     *
     * @return MovieInfo
     */
    public function setAudioFormat($value)
    {
        $this->audioFormat = $value;
        return $this;
    }
    /**
     * Getter for running time
     *
     * @return int
     */
    public function getRunningTime()
    {
        return $this->runningTime;
    }
    /**
     * Setter for running time
     *
     * @param int $value The running time
     *
     * @return MovieInfo
     */
    public function setRunningTime($value)
    {
        $this->runningTime = $value;
        return $this;
    }
    /**
     * Getter for aspect ratio
     *
     * @return string
     */
    public function getAspectRatio()
    {
        return $this->aspectRatio;
    }
    /**
     * Setter for aspect ratio
     *
     * @param string $value The aspect ratio
     *
     * @return MovieInfo
     */
    public function setAspectRatio($value)
    {
        $this->aspectRatio = $value;
        return $this;
    }
    /**
     * Getter for format name
     *
     * @return string
     */
    public function getFormatName()
    {
        return $this->formatName;
    }
    /**
     * Setter for format name
     *
     * @param string $value The format name
     *
     * @return MovieInfo
     */
    public function setFormatName($value)
    {
        $this->formatName = $value;
        return $this;
    }
    /**
     * Getter for color format
     *
     * @return string
     */
    public function getColorFormat()
    {
        return $this->colorFormat;
    }
    /**
     * Setter for color format
     *
     * @param string $value The color format
     *
     * @return MovieInfo
     */
    public function setColorFormat($value)
    {
        $this->colorFormat = $value;
        return $this;
    }
    /**
     * Getter for number of disc
     *
     * @return int
     */
    public function getNumberOfDisc()
    {
        return $this->numberOfDisc;
    }
    /**
     * Setter for number of disc
     *
     * @param int $value The number of disc
     *
     * @return MovieInfo
     */
    public function setNumberOfDisc($value)
    {
        $this->numberOfDisc = $value;
        return $this;
    }
    /**
     * Getter for rating
     *
     * @return string
     */
    public function getRating()
    {
        return $this->rating;
    }
    /**
     * Setter for rating
     *
     * @param string $value The rating
     *
     * @return MovieInfo
     */
    public function setRating($value)
    {
        $this->rating = $value;
        return $this;
    }
    /**
     * Getter for contract region
     *
     * @return string
     */
    public function getContractRegion()
    {
        return $this->contractRegion;
    }
    /**
     * Setter for contract region
     *
     * @param string $value The contract region
     *
     * @return MovieInfo
     */
    public function setContractRegion($value)
    {
        $this->contractRegion = $value;
        return $this;
    }
    /**
     * (non-PHPdoc)
     * @see HydraEntity::__loadDaoMap()
     */
    public function __loadDaoMap()
    {
        DaoMap::begin($this, 'mov_info');

        DaoMap::setManyToOne('product', 'Product', 'mov_info_pro');
        DaoMap::setStringType('alias', 'varchar', 50);
        DaoMap::setStringType('yearOfProduction', 'varchar', 4);
        DaoMap::setDateType('releaseDate');
        DaoMap::setStringType('director', 'varchar', 50);
        DaoMap::setStringType('language', 'varchar', 20);
        DaoMap::setStringType('subtitle', 'varchar', 20);
        DaoMap::setStringType('trailer', 'varchar', 15);
        DaoMap::setStringType('productType', 'varchar', 20);
        DaoMap::setStringType('actorName', 'varchar', 100);
        DaoMap::setStringType('audioFormat', 'varchar', 20);
        DaoMap::setIntType('runningTime');
        DaoMap::setStringType('aspectRatio', 'varchar', 10);
        DaoMap::setStringType('formatName', 'varchar', 80);
        DaoMap::setStringType('colorFormat', 'varchar', 15);
        DaoMap::setIntType('numberOfDisc');
        DaoMap::setStringType('rating', 'varchar', 10);
        DaoMap::setStringType('contractRegion', 'varchar', 50);

        parent::__loadDaoMap();
        DaoMap::createIndex('alias');
        DaoMap::createIndex('yearOfProduction');
        DaoMap::createIndex('releaseDate');
        DaoMap::createIndex('director');
        DaoMap::createIndex('language');
        DaoMap::createIndex('subtitle');
        DaoMap::createIndex('trailer');
        DaoMap::createIndex('productType');
        DaoMap::createIndex('actorName');
        DaoMap::createIndex('audioFormat');
        DaoMap::createIndex('runningTime');
        DaoMap::createIndex('aspectRatio');
        DaoMap::createIndex('formatName');
        DaoMap::createIndex('colorFormat');
        DaoMap::createIndex('numberOfDisc');
        DaoMap::createIndex('rating');
        DaoMap::createIndex('contractRegion');
        DaoMap::commit();
    }
    /**
     * creating a Movie Info
     *
     * @param Product       $product
     * @param string        $alias
     * @param string        $yearOfProduction
     * @param DateFormat    $releaseDate
     * @param string        $director
     * @param string        $language
     * @param string        $subtitle
     * @param string        $trailer
     * @param string        $productType
     * @param string        $actorName
     * @param string        $audioFormat
     * @param number        $runningTime
     * @param string        $aspectRatio
     * @param string        $formatName
     * @param string        $colorFormat
     * @param number        $numberOfDisc
     * @param string        $rating
     * @param string        $contractRegion
     *
     * @return MovieInfo
     */
    public static function create(Product $product, $alias = '', $yearOfProduction, $releaseDate, $director, $language, $subtitle, $trailer, $productType, $actorName, $audioFormat, $runningTime, $aspectRatio, $formatName, $colorFormat, $numberOfDisc, $rating, $contractRegion)
    {
        $entity = new MovieInfo();
        $entity->setProduct($product)
            ->setAlias($alias)
            ->setYearOfProduction($yearOfProduction)
            ->setReleaseDate($releaseDate)
            ->setDirector($director)
            ->setLanguage($language)
            ->setSubtitle($subtitle)
            ->setTrailer($trailer)
            ->setProductType($productType)
            ->setActorName($actorName)
            ->setAudioFormat($audioFormat)
            ->setRunningTime($runningTime)
            ->setAspectRatio($aspectRatio)
            ->setFormatName($formatName)
            ->setColorFormat($colorFormat)
            ->setNumberOfDisc($numberOfDisc)
            ->setRating($rating)
            ->setContractRegion($contractRegion)
            ->save();

        return $entity;
    }
}
