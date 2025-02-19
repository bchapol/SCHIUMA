/*
SQLyog Ultimate v12.09 (64 bit)
MySQL - 10.4.32-MariaDB : Database - schiuma
*********************************************************************
*/


/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`schiuma` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `schiuma`;

/*Table structure for table `categories` */

DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
  `pk_category` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`pk_category`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `categories` */

insert  into `categories`(`pk_category`,`name`) values (1,'Jabones artesanales'),(2,'Champú'),(3,'Loción'),(4,'Aceites corporales'),(5,'Sales de baño');

/*Table structure for table `customers` */

DROP TABLE IF EXISTS `customers`;

CREATE TABLE `customers` (
  `pk_customer` int(11) NOT NULL AUTO_INCREMENT,
  `fk_user` int(11) NOT NULL,
  `rfc` varchar(13) NOT NULL,
  `address` varchar(255) NOT NULL,
  PRIMARY KEY (`pk_customer`),
  KEY `fk_user` (`fk_user`),
  CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`fk_user`) REFERENCES `users` (`pk_user`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `customers` */

insert  into `customers`(`pk_customer`,`fk_user`,`rfc`,`address`) values (1,11,'HPM123456789','Av. Kukulcán Km 12.5, Zona Hotelera, Cancún, Quintana Roo'),(2,12,'SSA987654321','Blvd. Kukulcán Km 16.5, Zona Hotelera, Cancún, Quintana Roo\r\n'),(3,13,'RWS345678901','Av. Bonampak 456, SM 3, Cancún, Quintana Roo\r\n'),(4,14,'HJS678901234',' Av. Yaxchilán 202, SM 9, Cancún, Quintana Roo'),(5,15,'SOA789012345','Av. Nichupté 303, SM 11, Cancún, Quintana Roo');

/*Table structure for table `employees` */

DROP TABLE IF EXISTS `employees`;

CREATE TABLE `employees` (
  `pk_employee` int(11) NOT NULL AUTO_INCREMENT,
  `fk_user` int(11) NOT NULL,  
  `fk_role` int(11) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`pk_employee`),
  KEY `fk_user` (`fk_user`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`fk_user`) REFERENCES `users` (`pk_user`),
  CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`fk_role`) REFERENCES `roles` (`pk_role`)

) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `employees` */

insert  into `employees`(`pk_employee`,`fk_user`, `fk_role`, `password`) values (1,1, 1,'schiuma123'), (2,2,1,'jabones123'),(3,3,2,'aceites123'),(4,4,2,'locion123');

/*Table structure for table `products` */

DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `pk_product` int(11) NOT NULL AUTO_INCREMENT,
  `fk_provider` int(11) NOT NULL,
  `fk_category` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  PRIMARY KEY (`pk_product`),
  KEY `fk_provider` (`fk_provider`),
  KEY `fk_category` (`fk_category`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`fk_provider`) REFERENCES `providers` (`pk_provider`),
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`fk_category`) REFERENCES `categories` (`pk_category`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `products` */

insert  into `products`(`pk_product`,`fk_provider`,`fk_category`,`name`,`price`,`stock`,`description`,`image`) values (1,1,1,'Lavanda','49.11',33,'Relajante jabón con esencia de lavanda, ideal para un baño calmante.','jabonlavanda.png'),(2,2,1,'Canela y manzana','53.00',29,'Jabón con aroma cálido y especiado, perfecto para revitalizar la piel.','jaboncanelaymanzana.png'),(3,6,2,'Hidratante','88.99',40,'Champú que proporciona hidratación profunda, dejando el cabello suave y brillante.','champuhidratante.png'),(4,4,3,'Calmante','75.23',68,'Loción con ingredientes calmantes, perfecta para pieles sensibles.','locioncalmante.png'),(5,5,4,'Coco','116.35',41,'Aceite corporal de coco, excelente para hidratar y suavizar la piel.','aceitecoco.png'),(6,3,5,'Rosa','64.01',37,'Sales de baño con aroma a rosa, perfectas para un baño relajante.','salesrosa.png'),(7,2,4,'Almendras	','103.88',28,'Aceite de almendras, ideal para masajes y cuidado de la piel.','aceitealmendra.png'),(8,6,2,'Fortalecedor','92.47',35,'Champú formulado para fortalecer el cabello y reducir la caída.	','champufortalecedor.png'),(9,5,1,'	Flores','50.00',26,'Jabón floral suave, enriquecido con extractos de flores naturales.','jabonfloral.png'),(10,4,5,'Menta','75.50',30,'Sales de baño con esencia de menta, ideales para revitalizar y refrescar.','salesmenta.png'),(11,2,2,'Voluminizador','107.19',45,'Champú que añade volumen y cuerpo al cabello fino y sin vida.','champuvoluminizador.png'),(12,1,3,'Perfumada','89.72',29,'Loción con fragancia delicada, dejando la piel suave y perfumada.','locionperfumada.png'),(13,3,1,'Miel y avena','56.36',40,'Jabón nutritivo con miel y avena, excelente para hidratar y exfoliar la piel.','jabonmielyavena.png'),(14,5,4,'Aguacate','130.54',36,'Aceite nutritivo de aguacate, perfecto para pieles secas y dañadas.','aceiteaguacate.png'),(15,2,5,'	Manzanilla','60.91',45,'Sales de baño calmantes con extracto de manzanilla, perfectas para relajar.','salesmanzanilla.png'),(16,6,5,'Limón','62.65',27,'Sales de baño cítricas, ideales para energizar y revitalizar el cuerpo.','saleslimon.png'),(17,1,1,'Naranja','47.26',50,'Jabón cítrico refrescante, ideal para energizar y revitalizar la piel.','jabonnaranja.png'),(18,3,4,'Eucalipto','120.71',30,'Aceite refrescante de eucalipto, ideal para masajes relajantes.','aceiteeucalipto.png'),(19,5,3,'Hidratante','65.48',34,'Loción que proporciona hidratación intensa, ideal para pieles secas.','locionhidratante.png');

/*Table structure for table `providers` */

DROP TABLE IF EXISTS `providers`;

CREATE TABLE `providers` (
  `pk_provider` int(11) NOT NULL AUTO_INCREMENT,
  `fk_user` int(11) NOT NULL,
  PRIMARY KEY (`pk_provider`),
  KEY `fk_user` (`fk_user`),
  CONSTRAINT `providers_ibfk_1` FOREIGN KEY (`fk_user`) REFERENCES `users` (`pk_user`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `providers` */

insert  into `providers`(`pk_provider`,`fk_user`) values (1,5),(2,6),(3,7),(4,8),(5,9),(6,10);

/*Table structure for table `roles` */

DROP TABLE IF EXISTS `roles`;

CREATE TABLE `roles` (
  `pk_role` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`pk_role`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `roles` */

insert  into `roles`(`pk_role`,`name`) values (1,'Administrador'),(2,'Almacenista');


/*Table structure for table `sales` */

DROP TABLE IF EXISTS `sales`;

CREATE TABLE `sales` (
  `pk_sale` int(11) NOT NULL AUTO_INCREMENT,
  `fk_product` int(11) NOT NULL,
  `fk_customer` int(11) NOT NULL,
  `fk_employee` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `date` date NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `token` varchar(255) NOT NULL,
  PRIMARY KEY (`pk_sale`),
  KEY `fk_product` (`fk_product`),
  KEY `fk_customer` (`fk_customer`),
  KEY `fk_employee` (`fk_employee`),
  CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`fk_product`) REFERENCES `products` (`pk_product`),
  CONSTRAINT `sales_ibfk_2` FOREIGN KEY (`fk_customer`) REFERENCES `customers` (`pk_customer`),
  CONSTRAINT `sales_ibfk_3` FOREIGN KEY (`fk_employee`) REFERENCES `employees` (`pk_employee`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `sales` */

insert  into `sales`(`pk_sale`,`fk_product`,`fk_customer`,`fk_employee`,`quantity`,`date`,`total_price`,`token`) values (1,6,4,2,15,'2025-01-08','960.15','token1'),(2,14,4,2,9,'2025-01-08','1174.86','token1'),(3,19,1,4,20,'2025-02-01','1309.60','token2');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `pk_user` int(11) NOT NULL AUTO_INCREMENT,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(12) NOT NULL,
  `image` varchar(255) NOT NULL,
  PRIMARY KEY (`pk_user`),
  KEY `fk_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `users` */

insert  into `users`(`pk_user`,`status`,`name`,`email`,`phone`,`image`) values (1,1,'Mia','mia@gmail.com','9983524767','mia.png'),(2,1,'Brenda','brenda@gmail.com','9988565651','brenda.png'),(3,1,'Mario','mario@gmail.com','9981560546','mario.png'),(4,1,'Alexis','alexis@gmail.com','9982215443','alexis.png'),(5,1,'Jypesa','jypesa@gmail.com','9988513201','jypesa.png'),(6,1,'PureComfort Amenities','purecomfort@gmail.com','9980614605','purecomfort.png'),(7,1,'Serenity Essentials','serenity@gmail.com','9984132032','serenity.png'),(8,1,'Amenidades Elite','amenidadeselite@gmail.com','9982330611','amenidadeselite.png'),(9,1,'Suministros GranEstancia','granestancia@gmail.com','9931054804','granamenidades.png'),(10,1,'Esenciales Retiro Real','retiroreal@gmail.com','9981050658','retiroreal.png'),(11,1,'Hotel Paraíso del Mar','contacto@paraisodelmar.com','9984065131','paraisodelmar.png'),(12,1,'Spa Serenidad','info@spaserenidad.com','9925258557','serenidad.png'),(13,1,'Relax & Wellness Spa','contacto@relaxwellness.com','9955875696','relaxwellnes.png'),(14,1,'Hotel Jardines del Sol','contacto@jardinesdelsol.com','9987554769','jardinesdelsol.png'),(15,1,'Spa Oasis','info@spaoasis.com','9985485576','oasispa.png');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
